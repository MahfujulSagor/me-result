import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { jwt } = await req.json();

  if (!jwt) {
    return NextResponse.json(
      { error: "JWT token is missing" },
      { status: 400 }
    );
  }

  try {
    const response = NextResponse.json({ success: true });

    response.cookies.set("session_token", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000), //! 1 hour
    });

    return response;
  } catch (err) {
    console.error("Error creating JWT session:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
