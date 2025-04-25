import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req) {
    try {
        const { amount } = await req.json();

        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: "Custom Payment",
                    },
                    unit_amount: amount * 100, // Convert to cents
                },
                quantity: 1,
            }],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/failed`,
        });

        return NextResponse.json({ paymentUrl: session.url }, { status: 200 });

    } catch (error) {
        console.error("Payment Link Error:", error);
        return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 });
    }
}