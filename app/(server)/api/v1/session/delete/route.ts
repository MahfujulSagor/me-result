import { NextResponse } from "next/server";

export const DELETE = async () => {
  try {
    //? Clear the session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("session_token", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      expires: new Date(0), //? Expire the cookie immediately
    });

    return response;
  } catch (error) {
    console.error("Error deleting session", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
};
