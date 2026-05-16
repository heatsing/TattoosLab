import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuth0Client, isAuth0Configured } from "./src/lib/auth0";

const protectedRoutePatterns = [
  /^\/dashboard(?:\/.*)?$/,
  /^\/api\/generate(?:\/.*)?$/,
  /^\/api\/uploads(?:\/.*)?$/,
  /^\/api\/tryon(?:\/.*)?$/,
  /^\/api\/stripe\/checkout(?:\/.*)?$/,
  /^\/api\/stripe\/portal(?:\/.*)?$/,
  /^\/api\/paypal\/checkout(?:\/.*)?$/,
  /^\/api\/paypal\/subscription\/cancel(?:\/.*)?$/,
  /^\/api\/generations(?:\/.*)?$/,
];

function isProtectedRoute(pathname: string) {
  return protectedRoutePatterns.some((pattern) => pattern.test(pathname));
}

export async function middleware(request: NextRequest) {
  if (!isAuth0Configured) {
    return NextResponse.next();
  }

  const auth0 = getAuth0Client();

  if (!auth0) {
    return NextResponse.next();
  }

  const response = await auth0.middleware(request);

  if (!isProtectedRoute(request.nextUrl.pathname)) {
    return response;
  }

  const session = await auth0.getSession(request);

  if (session) {
    return response;
  }

  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set(
    "returnTo",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};