import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATH = ['/', '/auth/login'];
const PROTECTED_PATH = ['/dashboard', '/profile'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;

    if (PROTECTED_PATH.some(path => pathname.startsWith(path)) && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin));
    }

    if (token && PUBLIC_PATH.some(path => pathname === path)) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};