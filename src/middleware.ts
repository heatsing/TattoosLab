import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuth0Client } from "@/lib/auth0";

const protectedPrefixes = ["/dashboard", "/admin"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = request.nextUrl.clone();
  signInUrl.pathname = "/sign-in";
  signInUrl.search = "";
  signInUrl.searchParams.set(
    "returnTo",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(signInUrl);
}

export async function middleware(request: NextRequest) {
  const auth0 = getAuth0Client();

  if (!auth0) {
    if (request.nextUrl.pathname.startsWith("/auth/")) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = "/sign-in";
      signInUrl.search = "";
      return NextResponse.redirect(signInUrl);
    }

    if (isProtectedPath(request.nextUrl.pathname)) {
      return redirectToSignIn(request);
    }

    return NextResponse.next();
  }

  const response = await auth0.middleware(request);

  if (!isProtectedPath(request.nextUrl.pathname)) {
    return response;
  }

  const session = await auth0.getSession(request);

  if (!session?.user) {
    return redirectToSignIn(request);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
