import { db } from "@/appwrite/appwrite-server";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const RESULTS_COLLECTION_ID = process.env.APPWRITE_RESULTS_COLLECTION_ID!;

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const session_token = req.cookies.get("session_token")?.value;

  if (!session_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const semester = searchParams.get("semester") as string;
  const year = searchParams.get("year") as string;
  const session = searchParams.get("session") as string;
  const student_id = searchParams.get("student_id") as string;

  console.log("Search params:", { semester, year, session, student_id });

  if (!semester || !year || !session || !student_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const res = await db.listDocuments(DATABASE_ID, RESULTS_COLLECTION_ID, [
      Query.equal("year", year),
      Query.equal("semester", semester),
      Query.equal("academic_session", session),
      Query.equal("student_id", student_id),
      Query.limit(1),
    ]);

    if (res.documents.length === 0) {
      return NextResponse.json(
        { error: "No results found for the given criteria" },
        { status: 404 }
      );
    }
    console.log("Fetched results:", res);

    return NextResponse.json(res.documents[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
};
