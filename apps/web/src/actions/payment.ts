"use server"

import { BearerToken } from "./auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const STRIPE_PREMIUM_PLAN_ID = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_ID;

export async function upgradeToEnterprisePlan() {
    try {
        const token = await BearerToken();
        if (!token) {
            throw new Error("No token found");
        }

        const response = await fetch(`${BACKEND_URL}/stripe/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                planId: STRIPE_PREMIUM_PLAN_ID,
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating checkout session:", error);
    }
}