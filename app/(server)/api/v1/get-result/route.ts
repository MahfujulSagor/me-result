import { NextRequest, NextResponse } from "next/server";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const RESULTS_COLLECTION_ID = process.env.APPWRITE_RESULTS_COLLECTION_ID!;

export const GET = async (req: NextRequest) => {
  const formData = await req.formData();

  const studentId = formData.get("studentId") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!studentId || !email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
};
