import {connectDB} from '@/dbConfig/dbConfig'
import UserAuthenticationModel from '@/models/authModel'
import {NextRequest, NextResponse} from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SendEmail } from '@/helpers/verificationEmail';

connectDB();
export async function GET(request: NextRequest){
    try{
        const { searchParams } = request.nextUrl;
        const email = searchParams.get('email')
        if(!email) return NextResponse.json({error: 'Email is required'}, {status: 400});
        
        const existingUser = await UserAuthenticationModel.findOne({email});
        if(existingUser) return NextResponse.json({error: 'User already exists'}, {status: 400});

        return NextResponse.json({success: true}, {status: 201});

    }catch(error: any){ // eslint-disable-line
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function POST(request: NextRequest){
    try{
        const {email, firstName, lastName, password} = await request.json();
        if(!email || !firstName || !lastName || !password) return NextResponse.json({error: 'All fields is required'}, {status: 400});
        
        const userData = await UserAuthenticationModel.findOne({email});
        if(userData) return NextResponse.json({error: 'User already exists'}, {status: 400});
        
        const hashedPassword = await bcrypt.hash(password, 12)

        const data = await UserAuthenticationModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            isVerified: false,
        })

        const token = jwt.sign({ id: data._id}, process.env.JWT_TOKEN_SECRET || "", { algorithm: 'HS256', expiresIn: '20d'  });

        SendEmail({email1: email, userName: firstName, emailType: "verification", verificationLink: `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/verify?token=${token}`, key: ''})
        
        return NextResponse.json({success: true}, {status: 200});

    }catch(error: any){ // eslint-disable-line
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET || "");
        } catch (error: any) { // eslint-disable-line
            if (error.name === 'JsonWebTokenError') {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
            }
            if (error.name === 'TokenExpiredError') {
                return NextResponse.json({ error: 'Token expired' }, { status: 401 });
            }
            return NextResponse.json({ error: 'Failed to verify token' }, { status: 500 });
        }

        const userId = (decodedToken as { id: string }).id;

        if (!userId) {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
        }

        const user = await UserAuthenticationModel.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: 'User already verified' }, { status: 200 });
        }

        user.isVerified = true;
        await user.save();

        return NextResponse.json({ success: true, message: 'User verified successfully' }, { status: 200 });
    } catch (error: any) { // eslint-disable-line
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}