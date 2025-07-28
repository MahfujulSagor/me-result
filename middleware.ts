import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  //? Allow assets & public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  try {
    const hasSession = req.cookies.get(`session_token`)?.value;

    if (!hasSession) {
      return NextResponse.redirect(new URL("/auth/login", origin));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/result-portal", origin));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware session validation failed", err);
    return NextResponse.redirect(new URL("/auth/login", origin));
  }
}

export const config = {
  matcher: [
    "/result-portal/:path*",
    "/publish-result/:path*",
    "/((?!auth|api|_next|favicon.ico).*)",
  ],
};
