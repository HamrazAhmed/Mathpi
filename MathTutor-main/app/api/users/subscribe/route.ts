import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/dbConfig/dbConfig";
// import SubscribedAuthenticationModel from '@/models/logindUserModel';

connectDB();

export async function POST(request: NextRequest){
    try{
        const { email, name } = await request.json();
        if(!email || !name) return NextResponse.json({error: 'All fields is required'}, {status: 400});
        
        // const userData = await SubscribedAuthenticationModel.findOne({email});
        // if(userData) return NextResponse.json({error: 'You have already Subscribed'}, {status: 400});
        
        // await SubscribedAuthenticationModel.create({
        //     email: email,
        //     name: name
        // })
        
        return NextResponse.json({success: true}, {status: 200});

    }catch(error: any){ // eslint-disable-line
        return NextResponse.json({error: error.message}, {status: 500})
    }
}