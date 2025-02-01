'use server';

import { ForgotPasswordFormData, LoginFormData, RegisterFormData, ResetPasswordFormData } from '@/schemas/loginSchema';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not set.');
}

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
};

async function handleFetchResponse(response: Response) {
    try {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue.');
        }
        return data;
    } catch (error) {
        console.error('Error processing response:', error);
        throw error;
    }
}

export async function login(data: LoginFormData) {
    try {
        const cookieStore = cookies();
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(data),
        });

        const result = await handleFetchResponse(response);

        (await cookieStore).set('token', result.token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
        });

        return { success: true };
    } catch (error) {
        console.error('Login failed:', error);
        return { success: false, message: (error as Error).message };
    }
}

export async function registerUser(data: RegisterFormData) {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(data),
        });

        await handleFetchResponse(response);

        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function forgotPassword(data: ForgotPasswordFormData) {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/request-reset-password`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(data),
        });

        await handleFetchResponse(response);

        return { success: true };
    } catch (error) {
        console.error('Forgot password request failed:', error);
        return { success: false, message: (error as Error).message };
    }
}

export async function getSessionData() {
    try {
        const cookieStore = cookies();
        return (await cookieStore).get('token')?.value || null;
    } catch (error) {
        console.error('Error retrieving session data:', error);
        return null;
    }
}

export async function logout() {
    try {
        const cookieStore = cookies();
        (await cookieStore).delete('token');
        return { success: true };
    } catch (error) {
        console.error('Logout failed:', error);
        return { success: false, message: (error as Error).message };
    }
}

export async function auth() {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;

        if (!token) {
            return null;
        }

        const response = await fetch(`${BACKEND_URL}/auth`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        return await handleFetchResponse(response);
    } catch (error) {
        console.error('Authentication failed:', error);
        return null;
    }
}

export async function BearerToken() {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;

        if (!token) {
            return null;
        }

        return token;
    } catch (error) {
        console.error('BearerToken failed:', error);
        return null;
    }
}

export async function resetPassword(data: ResetPasswordFormData, token: string) {
    try {
        const requestBody = {
            ...data,
            token,
        };

        const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(requestBody),
        });

        await handleFetchResponse(response);

        return { success: true };
    } catch (error) {
        console.error('Reset password failed:', error);
        return { success: false, message: (error as Error).message };
    }
}
