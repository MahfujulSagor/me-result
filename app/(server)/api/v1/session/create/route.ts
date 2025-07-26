import { account } from "@/appwrite/appwrite-server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { email, password }: { email: string; password: string } =
    await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  try {
    const session = await account.createEmailPasswordSession(email, password);

    const response = NextResponse.json({ success: true });
    response.cookies.set("session_token", session.secret || "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire || Date.now() + 3600 * 1000),
    });

    return response;
  } catch (error) {
    console.error("Invalid credentials", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
};
