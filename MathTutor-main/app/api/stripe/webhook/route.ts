import UserAuthenticationModel from '@/models/authModel';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const PRICES = {
    basic: process.env.BASIC_PRICE_ID,
    gold: process.env.GOLD_PRICE_ID,
    premium: process.env.PREMIUM_PRICE_ID,
};

export async function POST(req) {
    try {
        const body = await req.text(); // Get raw body
        const sig = req.headers.get('stripe-signature');

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;

        try {
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        } catch (err) {
            console.log(err);
            return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
        }

        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const customerEmail = invoice.customer_email;
            const customerId = invoice.customer; // Extract customer ID
            const priceID = invoice.lines.data[0]?.price?.id;
            const subscriptionId = invoice.lines.data[0]?.parent?.subscription_item_details?.subscription;

            const existingUser = await UserAuthenticationModel.findOne({ email: customerEmail });
            if (!existingUser) {
                console.error(`User not found: ${customerEmail}`);
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const newPlan = priceID === PRICES['basic'] ? 'basic' : 
                            priceID === PRICES['gold'] ? 'gold' : 
                            priceID === PRICES['premium'] ? 'premium' : "";

            const newCredits = existingUser.credits + (newPlan === 'basic' ? 50 : newPlan === 'gold' ? 120 : newPlan === 'premium' ? 300 : 20);
            
            existingUser.credits = newCredits;
            existingUser.plan = newPlan;
            existingUser.customer = customerId; // Store customer ID if needed
            existingUser.subscriptionId = subscriptionId; // Store customer ID if needed
            await existingUser.save();
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
