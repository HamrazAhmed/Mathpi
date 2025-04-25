import { connectDB } from '@/dbConfig/dbConfig'
import UserAuthenticationModel from '@/models/authModel'
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server'

connectDB();
export async function GET(request: NextRequest) {

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
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    try {
        if (!ownerId) {
            return NextResponse.json({ error: 'Invalid Id' }, { status: 401 });
        }
        const existingUser = await UserAuthenticationModel.findById(ownerId);
        if (!existingUser) return NextResponse.json({ error: 'Not Found' }, { status: 400 });

        return NextResponse.json({ plan: existingUser.plan, credits: existingUser.credits }, { status: 200 });

    } catch (error: any) { // eslint-disable-line
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}