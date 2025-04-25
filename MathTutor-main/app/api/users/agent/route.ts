import { connectDB } from "@/dbConfig/dbConfig";
import ChatHistoryModel from "@/models/chatHistoryModel";
import Groq from "groq-sdk";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions.mjs";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import ChatModel from "@/models/chatModel";
import UserAuthenticationModel from "@/models/authModel";

const apis = [
    "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",
];

const groq = new Groq({
    apiKey: apis[Math.floor(Math.random() * apis.length)],
});


const template = `Act as a patient, detail-oriented math tutor. Your role is to help users solve mathematical equations by guiding them through each step logically and clearly. For any given equation:

1. Identify the type of equation (e.g., linear, quadratic) and explain its structure.
2. Break down the solution process into simple, sequential steps.
3. Explain each step in plain language, avoiding jargon. Highlight rules or principles used (e.g., inverse operations, factoring).
4. Check for understanding by asking the user if they follow or have questions.
5. Verify the solution by substituting the answer back into the original equation.
6. Summarize the key takeaways and offer to tackle another problem.

### Example Explanation for 2x + 4 = 0:

**Identify the equation type:**
This is a linear equation in one variable (\`x\`). The goal is to isolate \`x\`.

**Step 1: Subtract 4 from both sides**
\`\`\`
2x + 4 - 4 = 0 - 4
\`\`\`
Simplifies to:
\`\`\`
2x = -4
\`\`\`

**Why?**
We undo the \`+4\` by subtracting 4, following the rule of inverse operations to isolate the term containing \`x\`.

**Step 2: Divide both sides by 2**
\`\`\`
2x / 2 = -4 / 2
\`\`\`
Simplifies to:
\`\`\`
x = -2
\`\`\`

**Why?**
Dividing by 2 cancels the coefficient of \`x\`, leaving the solution.

**Check understanding:**
Does this step make sense? Would you like me to clarify anything?

**Verify the solution:**
Substitute \`x = -2\` into the original equation:
\`\`\`
2(-2) + 4 = 0
\`\`\`
Simplifies to:
\`\`\`
-4 + 4 = 0
\`\`\`
This confirms the solution is correct.

**Summary:**
To solve linear equations like \`ax + b = 0\`, use inverse operations: first subtract \`b\`, then divide by \`a\`. Let’s try another problem if you’re ready!

### Agent’s Role Clarification:
- You are the tutor; the user is the learner.
- Prioritize clarity over speed.
- Encourage questions and adapt explanations to the user’s pace.
`;


export async function POST(request: NextRequest) {
    connectDB();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let ownerId;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (!payload.id) {
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }
        ownerId = payload.id;
    } catch (error) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    try {
        const { prompt, messages, type, imageLink } = await request.json();

        const chatDetails = await ChatModel.findOne({ ownerId: ownerId });


        if (!chatDetails) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        const chatHistoryId = chatDetails._id;


        if (!Array.isArray(messages)) {
            return NextResponse.json({ error: 'Prompt and messages array are required' }, { status: 400 });
        }

        const recentMessages = messages.length > 2 ? messages.slice(-2) : messages;
        await ChatHistoryModel.create({
            sender: "User",
            owner: ownerId,
            text: prompt,
            imageUrl: imageLink ?? '',
            chatId: chatHistoryId
        });

        if (type === "text") {
            const formattedMessages: ChatCompletionMessageParam[] = recentMessages.map((msg) => ({
                role: msg.sender === "User" ? "user" : "assistant",
                content: msg.text,
            }));
            formattedMessages.unshift({ role: "system", content: template });

            const chatResponse = await groq.chat.completions.create({
                messages: formattedMessages,
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                stop: null,
                top_p: 1,
            });

            await ChatHistoryModel.create({
                sender: "Assistant",
                owner: ownerId,
                text: chatResponse.choices[0].message.content,
                imageUrl: '',
                chatId: chatHistoryId
            });

            const updatedCheckCount = await UserAuthenticationModel.findOneAndUpdate({ _id: ownerId }, { $inc: { credits: -1 } }, { new: true });
            chatResponse.checkCount = updatedCheckCount.credits;
            return NextResponse.json(chatResponse, { status: 200 });
        } else {
            const messages = [
                { role: 'assistant', content: template },
                {
                    role: 'user', content: [
                        { type: 'text', text: prompt ?? "Check out this and solve" },
                        { "type": "image_url", "image_url": { "url": imageLink } }
                    ]
                }
            ];

            const chatResponse = await groq.chat.completions.create({
                messages: messages,
                model: "llama-3.2-11b-vision-preview",
                temperature: 0.5,
                stop: null,
                top_p: 1,
            });

            await ChatHistoryModel.create({
                sender: "Assistant",
                owner: ownerId,
                text: chatResponse.choices[0].message.content,
                imageUrl: '',
                chatId: chatHistoryId
            });
            const updatedCheckCount = await UserAuthenticationModel.findOneAndUpdate({ _id: ownerId }, { $inc: { credits: -2 } }, { new: true });
            chatResponse.checkCount = updatedCheckCount.credits;

            return NextResponse.json(chatResponse, { status: 200 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    connectDB();

    const generateRandomId = (length = 10) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
    };


    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let ownerId;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (!payload.id) {
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }
        ownerId = payload.id;
    } catch (error) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    let chatDetails = await ChatModel.findOne({ ownerId: ownerId });

    if (!chatDetails) {
        chatDetails = await ChatModel.create({ name: generateRandomId(), description: '', ownerId });
    }

    const chatId = chatDetails._id;

    if (!chatId) {
        return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    try {
        const chatHistory = await ChatHistoryModel.countDocuments({ chatId, owner: ownerId });
        const auth = await UserAuthenticationModel.findById(ownerId);
        return NextResponse.json({ chatHistory:chatHistory, roadmap: auth.roadmapCreated }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
