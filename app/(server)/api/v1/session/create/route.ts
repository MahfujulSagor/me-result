import { account } from "@/appwrite/appwrite-server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { email, password }: { email: string; password: string } =
    await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const session = await account.createEmailPasswordSession(email, password);
    const session_token = session.secret || "";

    if (!session_token) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }
    const response = NextResponse.json({ success: true });

    response.cookies.set("session_token", session_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(session_token ? Date.now() + 60 * 60 * 1000 : 0), // 1 hour
    });

    return response;
  } catch (err) {
    console.error("Login failed", err);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
};
