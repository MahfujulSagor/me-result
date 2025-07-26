import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  //? Allow public and system paths
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const sessionToken = req.cookies.get("session_token")?.value;

  if (!sessionToken) {
    console.warn("No session token found");
    //? Redirect with error query to trigger toast on login page
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

    if (validateRes.status === 200) {
      return NextResponse.next();
    } else {
      //? Session invalid or expired — redirect with error to show toast
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
    "/publish-result/:path*",
    "/result-portal/:path*",
    "/((?!auth|api|_next|favicon.ico).*)",
  ],
};
