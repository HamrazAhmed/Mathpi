import { connectDB } from '@/dbConfig/dbConfig';
import UserAuthenticationModel from '@/models/authModel';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

connectDB();

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET || "");
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const user = await UserAuthenticationModel.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.credits === undefined) {
            user.credits = 50; // Assign 50 credits if the field is missing
            await user.save(); // Save the updated user document
        }

        return NextResponse.json({ credits: user.credits }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}