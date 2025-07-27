import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  const isAuthRoute = pathname.startsWith("/auth");
  const sessionToken = req.cookies.get("session_token")?.value;

  //? Allow public and system paths
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  if (!sessionToken) {
    if (
      isAuthRoute ||
      pathname.startsWith("/api/v1/session") ||
      pathname.startsWith("/api/v1/create-user")
    ) {
      return NextResponse.next(); //? allow login/signup/api
    }

    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set("error", "no-session");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const validateRes = await fetch(`${origin}/api/v1/session/validate`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") ?? "", //? forward cookies
      },
    });

    const isValid = validateRes.status === 200;

    if (isValid) {
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/result-portal", origin));
      }

      return NextResponse.next();
    } else {
      const loginUrl = new URL("/auth/login", origin);
      loginUrl.searchParams.set("error", "session-expired");
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Session validation failed:", error);
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set("error", "session-error");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/publish-result/:path*",
    "/result-portal/:path*",
    "/((?!auth|api|_next|favicon.ico).*)",
  ],
};
