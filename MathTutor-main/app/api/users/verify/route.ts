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
        const password = searchParams.get('password')
        if(!email || !password) return NextResponse.json({error: 'All fields is required'}, {status: 400});
        
        const existingUser = await UserAuthenticationModel.findOne({email});
        if(!existingUser) return NextResponse.json({error: 'Please Register'}, {status: 400});

        const isMatch = await bcrypt.compare(password, existingUser.password);
        
        if(!isMatch) return NextResponse.json({error: 'Invalid credentials'}, {status: 401});

        const token = jwt.sign({ id: existingUser._id}, process.env.JWT_TOKEN_SECRET || "", { algorithm: 'HS256', expiresIn: '20d' });

        if(!existingUser.isVerified){
            
            const verificationLink = `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/verify?key=${token}`;

            SendEmail({
                email1: existingUser.email,
                userName: existingUser.firstName,
                emailType: 'verification',
                verificationLink,
                key: '',
            });

            return NextResponse.json({emailSent: true, verified: false}, {status: 201});
        }

        return NextResponse.json({verified: true, emailSent: false, token: token}, {status: 201});

    }catch(error: any){ // eslint-disable-line
        return NextResponse.json({error: error.message}, {status: 500})
    }
}


export async function POST(request: NextRequest){
    try{
        const { email } = await request.json();
        if(!email) return NextResponse.json({error: 'All fields is required'}, {status: 400});
        
        const existingUser = await UserAuthenticationModel.findOne({email});
        if(!existingUser) return NextResponse.json({error: 'Please Register'}, {status: 400});

        const token = jwt.sign({ id: existingUser._id}, process.env.JWT_TOKEN_SECRET || "", { algorithm: 'HS256', expiresIn: '20d' });
        

        if(existingUser.isVerified){
            return NextResponse.json({message: 'Email already verified'}, {status: 400});
        }

        const verificationLink = `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/verify?key=${token}`;

        SendEmail({
            email1: existingUser.email,
            userName: existingUser.firstName,
            emailType: 'verification',
            verificationLink,
            key: '',
        });

        return NextResponse.json({emailSent: true, verified: false}, {status: 201});

    }catch(error: any){ // eslint-disable-line
        return NextResponse.json({error: error.message}, {status: 500})
    }
}