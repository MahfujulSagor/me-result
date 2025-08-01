import { db, validateJwt } from "@/appwrite/appwrite-server";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const RESULTS_COLLECTION_ID = process.env.APPWRITE_RESULTS_COLLECTION_ID!;

export const POST = async (req: NextRequest) => {
  const {
    year,
    semester,
    academic_session,
    student_id,
  }: {
    year: string;
    semester: string;
    academic_session: string;
    student_id: string;
  } = await req.json();

  const session_token = req.cookies.get("session_token")?.value;
  if (!session_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await validateJwt(session_token);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  if (!semester || !year || !academic_session || !student_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const res = await db.listDocuments(DATABASE_ID, RESULTS_COLLECTION_ID, [
      Query.equal("student_id", student_id.trim().toUpperCase()),
      Query.equal("academic_session", academic_session.trim()),
      Query.equal("year", year.trim()),
      Query.equal("semester", semester.trim()),
    ]);

    if (res.documents.length === 0) {
      return NextResponse.json(
        { error: "No results found for the given criteria" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.documents[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
};
