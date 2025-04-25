import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import ChatModel from "@/models/chatModel";


export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const ownerId = req.headers.get("x-user-id");
    if (!ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();

    // Validate input
    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    const newChat = await ChatModel.create({ name, description, ownerId });

    return NextResponse.json({ success: true, chat: newChat }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    await connectDB();
  
    try {
      const ownerId = req.headers.get("x-user-id"); // Get user ID from headers
      console.log("Fetching chat history for ownerId:", ownerId);
  
      if (!ownerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const chats = await ChatModel.find({ ownerId });
  
      return NextResponse.json({ success: true, chats }, { status: 200 });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  

