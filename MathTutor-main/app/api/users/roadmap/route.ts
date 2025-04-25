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
        console.log(err)
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    try {
        // chatHistoryId
        const { days, topic } = await request.json();

        if (!days || !topic) {
            return NextResponse.json({ error: "Both 'days' and 'topic' parameters are required" }, { status: 400 });
        }

        const template = `
        Generate a ${days}-day learning roadmap for ${topic} in JSON format. Each day should have:
        
        - A unique id and title in the format "Day X".
        - A heading summarizing the day's focus.
        - A description explaining key learning points in bullet points.
        - A list of objectives summarizing learning goals.
        - A list of resources, each containing:
          - Type (e.g., video, book, article)
          - Title
          - Author
          - Platform (if applicable)
        
        Format the output as follows:

        [
            {
                "id": "1",
                "title": "Day 1",
                "heading": "Introduction to ${topic}",
                "description": "Understand the basics of ${topic} • Learn key terminologies • Explore beginner-friendly resources",
                "objectives": [
                    "Understand the fundamentals of ${topic}",
                    "Familiarize with key concepts",
                    "Explore real-world applications"
                ],
                "resources": [
                    {
                        "type": "video",
                        "title": "Introduction to ${topic}",
                        "author": "XYZ",
                        "platform": "YouTube"
                    },
                    {
                        "type": "book",
                        "title": "${topic} for Beginners",
                        "author": "John Doe"
                    }
                ]
            },
            {
                "id": "2",
                "title": "Day 2",
                "heading": "Core Concepts of ${topic}",
                "description": "Deep dive into core principles • Learn about key techniques • Implement simple projects",
                "objectives": [
                    "Understand core concepts",
                    "Learn essential techniques",
                    "Apply knowledge through small exercises"
                ],
                "resources": [
                    {
                        "type": "video",
                        "title": "Core Concepts of ${topic}",
                        "author": "ABC",
                        "platform": "Udemy"
                    },
                    {
                        "type": "article",
                        "title": "Understanding ${topic} Fundamentals",
                        "author": "Tech Journal"
                    }
                ]
            }
        ]
        
        Continue this structure for all ${days} days.
        `;

        const chatResponse = await groq.chat.completions.create({
            messages: [{ role: "system", content: template }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            stop: null,
            top_p: 1,
        });

        const roadmap = chatResponse.choices[0].message.content;

        const updatedCheckCount = await UserAuthenticationModel.findOneAndUpdate({ _id: ownerId }, { $inc: { credits: -2,  roadmapCreated: 1 } }, { new: true });

        return NextResponse.json({roadmap: roadmap, credits: updatedCheckCount.credits}, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
