import { NextRequest, NextResponse } from "next/server";
import { account } from "@/appwrite/appwrite-client";

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "No session token" }, { status: 401 });
  }

  try {
    account.client.setSession(sessionToken);

    await account.get();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Session validation failed:", err);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
