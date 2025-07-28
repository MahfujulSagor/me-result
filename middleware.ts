import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "./appwrite/appwrite-server";

// ✅ Define only blocked paths
const blockedRoutes = {
  admin: {
    routes: ["/result-portal"],
    apis: [],
  },
  user: {
    routes: ["/publish-result"],
    apis: ["/api/v1/admin"],
  },
};

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  //? Allow public assets and auth pages
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/v1/session")
  ) {
    return NextResponse.next();
  }

  const sessionToken = req.cookies.get("session_token")?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  const isAdmin = user.$id === process.env.ADMIN_USER_ID;
  const isAPI = pathname.startsWith("/api");

  const isBlocked = (list: string[]) =>
    list.some((path) => pathname.startsWith(path));

  // ❌ Block admins if the path is in admin-blocked list
  if (
    isAdmin &&
    ((isAPI && isBlocked(blockedRoutes.admin.apis)) ||
      (!isAPI && isBlocked(blockedRoutes.admin.routes)))
  ) {
    return isAPI
      ? NextResponse.json({ error: "Forbidden for admin" }, { status: 403 })
      : NextResponse.redirect(new URL("/publish-result", origin));
  }

  // ❌ Block users if the path is in user-blocked list
  if (
    !isAdmin &&
    ((isAPI && isBlocked(blockedRoutes.user.apis)) ||
      (!isAPI && isBlocked(blockedRoutes.user.routes)))
  ) {
    return isAPI
      ? NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      : NextResponse.redirect(new URL("/result-portal", origin));
  }

  // 🏠 Redirect root path
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isAdmin ? "/publish-result" : "/result-portal", origin)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
