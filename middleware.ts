import { NextRequest, NextResponse } from "next/server";
import { validateJwt } from "./appwrite/appwrite-server";

//*  Blocked paths
const blockedRoutes = {
  admin: {
    routes: ["/result-portal"], //? Admins should not access result portal
    apis: [],
  },
  user: {
    routes: ["/admin"], //? Users should not access admin routes
    apis: ["/api/v1/admin"], //? Users should not access admin APIs
  },
};

const origin = process.env.NEXT_PUBLIC_BASE_URL!;
const ADMIN_ID = process.env.ADMIN_USER_ID!;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //? Allow public assets and auth pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/refresh-jwt") ||
    pathname.startsWith("/api/v1/session")
  ) {
    return NextResponse.next();
  }

  const sessionToken = req.cookies.get("session_token")?.value;
  if (!sessionToken) {
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  const user = await validateJwt(sessionToken);
  if (!user) {
    //? If JWT is invalid, try to validate session
    if (!user) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const redirectUrl = new URL("/refresh-jwt", origin);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  //! 🚫 Redirect authenticated users away from /auth pages
  if (pathname.startsWith("/auth")) {
    const route: string =
      user.$id === ADMIN_ID ? "/admin/dashboard" : "/result-portal";
    return NextResponse.redirect(new URL(route, origin));
  }

  const isAdmin: boolean = user.$id === ADMIN_ID;
  const isAPI: boolean = pathname.startsWith("/api");

  const isBlocked = (list: string[]): boolean => {
    return list.some((path) => pathname.startsWith(path));
  };

  //! ❌ Block admin if the path is in admin-blocked list
  if (
    isAdmin &&
    ((isAPI && isBlocked(blockedRoutes.admin.apis)) ||
      (!isAPI && isBlocked(blockedRoutes.admin.routes)))
  ) {
    return isAPI
      ? NextResponse.json({ error: "Forbidden for admin" }, { status: 403 })
      : NextResponse.redirect(new URL("/admin/dashboard", origin));
  }

  //! ❌ Block users if the path is in user-blocked list
  if (
    !isAdmin &&
    ((isAPI && isBlocked(blockedRoutes.user.apis)) ||
      (!isAPI && isBlocked(blockedRoutes.user.routes)))
  ) {
    return isAPI
      ? NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      : NextResponse.redirect(new URL("/result-portal", origin));
  }

  //* 🏠 Redirect root path
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/result-portal", origin)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
