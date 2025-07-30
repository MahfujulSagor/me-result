import { NextRequest, NextResponse } from "next/server";
import { validateJwt } from "@/appwrite/appwrite-server";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!;

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const session_token = req.cookies.get("session_token")?.value;
  if (!session_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await validateJwt(session_token);
  if (!user) {
    return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
  }

  if (user.$id !== ADMIN_USER_ID) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const student_id = searchParams.get("student_id") as string;
  const semester = searchParams.get("semester") as string;
  const year = searchParams.get("year") as string;
  const academic_session = searchParams.get("academic_session") as string;

  if (!student_id || !semester || !year || !academic_session) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  //* Process the formData as needed
};
