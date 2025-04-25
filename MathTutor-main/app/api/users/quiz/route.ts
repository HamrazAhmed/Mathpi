import { connectDB } from "@/dbConfig/dbConfig";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import UserAuthenticationModel from "@/models/authModel";
// import ChatHistoryModel from "@/models/chatHistoryModel";

const apis = [
    "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",
];

const groq = new Groq({
    apiKey: apis[Math.floor(Math.random() * apis.length)],
});

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
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    try {
        const { topic, complexity } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "The 'topic' parameter is required" }, { status: 400 });
        }

        const template = `
        Generate a quiz with 10 multiple-choice questions about ${topic} at a ${complexity} difficulty level in JSON format.
        
        Each question should have:
        - A unique id.
        - A question title relevant to ${topic}.
        - Four answer choices (option1, option2, option3, option4).
        - The correct answer as a key-value pair.
        - A brief explanation for the correct answer.

        The difficulty level is defined as follows:
        Easy: Questions should be fundamental, covering basic concepts.
        Medium: Questions should include slightly advanced details and minor problem-solving.
        Hard: Questions should be challenging, involving deep concepts, reasoning, or calculations.

        Format the output as follows:

        [
            {
                "id": 1,
                "title": "What is the capital of France?",
                "option1": "London",
                "option2": "Paris",
                "option3": "Berlin",
                "option4": "Madrid",
                "correct": "option2",
                "reason": "Paris is the capital and largest city of France, known for its Eiffel Tower and cultural heritage."
            },
            {
                "id": 2,
                "title": "Which programming language is widely used for web development?",
                "option1": "C++",
                "option2": "Python",
                "option3": "JavaScript",
                "option4": "Ruby",
                "correct": "option3",
                "reason": "JavaScript is commonly used for front-end and back-end web development."
            }
        ]

        Continue this structure for 10 questions related to ${topic}.
        `;

        const chatResponse = await groq.chat.completions.create({
            messages: [{ role: "system", content: template }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            stop: null,
            top_p: 1,
        });

        const quizData = chatResponse.choices[0].message.content;
        const updatedCheckCount = await UserAuthenticationModel.findOneAndUpdate({ _id: ownerId }, { $inc: { credits: -2 } }, { new: true });

        return NextResponse.json({ quizData: quizData, credits: updatedCheckCount.credits }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
