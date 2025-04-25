import { connectDB } from '@/dbConfig/dbConfig';
import UserAuthenticationModel from '@/models/authModel';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const PRICES = {
  basic: process.env.BASIC_PRICE_ID,
  gold: process.env.GOLD_PRICE_ID,
  premium: process.env.PREMIUM_PRICE_ID,
};

export async function POST(req) {
  connectDB();

  const authHeader = req.headers.get("authorization");
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
    const { planId } = await req.json();
    const priceId = PRICES[planId];
    const existingUser = await UserAuthenticationModel.findById(ownerId);

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid request: Plan and User ID are required' }, { status: 400 });
    }

    let stripeCustomerId = existingUser.customer;
    let existingSubscription = existingUser.subscriptionId;

    if (stripeCustomerId && existingSubscription) {
      const subscription = await stripe.subscriptions.retrieve(existingSubscription);

      if (subscription) {
        const updatedSubscription = await stripe.subscriptions.update(existingSubscription, {
          cancel_at_period_end: false,
          items: [{ id: subscription.items.data[0].id, price: priceId }],
          proration_behavior: 'create_prorations',
        });
        existingUser.subscriptionId = updatedSubscription.id;

        return NextResponse.json({ message: "Subscription Updated", subscriptionId: updatedSubscription.id }, { status: 200 });
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: existingUser.email,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment`,
    });

    return NextResponse.json({ sessionUrl: session.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  connectDB();

  const authHeader = req.headers.get("authorization");
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
    const existingUser = await UserAuthenticationModel.findById(ownerId);
    if (!existingUser || !existingUser.subscriptionId) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    const subscription = await stripe.subscriptions.retrieve(existingUser.subscriptionId);
    if (!subscription || subscription.status !== 'active') {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    await stripe.subscriptions.cancel(existingUser.subscriptionId);

    existingUser.subscriptionId = null;
    existingUser.plan = "";
    await existingUser.save();

    return NextResponse.json({ message: "Subscription cancelled successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
