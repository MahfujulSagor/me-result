import { NextRequest, NextResponse } from "next/server";
import { validateJwt, db } from "@/appwrite/appwrite-server";
import { Query } from "appwrite";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const RESULTS_COLLECTION_ID = process.env.APPWRITE_RESULTS_COLLECTION_ID!;

export const GET = async (req: NextRequest) => {
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

  try {
    const recent = await db.listDocuments(DATABASE_ID, RESULTS_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.limit(1), //? Fetch the most recent result
    ]);

    if (!recent.documents.length) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const { academic_session, semester, year } = recent.documents[0];

    //? Fetch all results for the same academic session, semester, and year
    const matchingResults = await db.listDocuments(
      DATABASE_ID,
      RESULTS_COLLECTION_ID,
      [
        Query.equal("academic_session", academic_session.trim()),
        Query.equal("semester", semester.trim()),
        Query.equal("year", year.trim()),
        Query.limit(50), //? Limit to 50 results
      ]
    );

    if (!matchingResults.documents.length) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    //? Count grade frequencies
    const gradeMap: Record<string, number> = {};

    for (const doc of matchingResults.documents) {
      const grade = doc.grade?.toUpperCase().trim();
      if (!grade) continue;
      gradeMap[grade] = (gradeMap[grade] || 0) + 1;
    }

    //? Academic grade order
    const gradeOrder = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];

    //? Convert to array and sort by academic grade order
    const formatted = Object.entries(gradeMap)
      .map(([grade, count]) => ({ grade, count }))
      .sort((a, b) => {
        const indexA = gradeOrder.indexOf(a.grade); //? Use index to determine order
        const indexB = gradeOrder.indexOf(b.grade); //? Use index to determine order
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB); //? Place unknown grades at the end
      });

    return NextResponse.json(
      {
        results: formatted,
        academic_details: { academic_session, semester, year },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching latest results:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest results" },
      { status: 500 }
    );
  }
};
