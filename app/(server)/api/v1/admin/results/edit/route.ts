import { NextRequest, NextResponse } from "next/server";
import { db, validateJwt } from "@/appwrite/appwrite-server";
import { Query } from "appwrite";
import { StudentResult } from "@/types/resultType";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const RESULTS_COLLECTION_ID = process.env.APPWRITE_RESULTS_COLLECTION_ID!;

//* POST method to fetch results for editing
export const POST = async (req: NextRequest) => {
  const {
    student_id,
    semester,
    year,
    academic_session,
  }: {
    student_id: string;
    semester: string;
    year: string;
    academic_session: string;
  } = await req.json();

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

  if (!student_id || !semester || !year || !academic_session) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const response = await db.listDocuments(
      DATABASE_ID,
      RESULTS_COLLECTION_ID,
      [
        Query.equal("student_id", student_id.trim()),
        Query.equal("semester", semester.trim()),
        Query.equal("year", year.trim()),
        Query.equal("academic_session", academic_session.trim()),
      ]
    );

    if (response.total === 0) {
      return NextResponse.json(
        { error: "No results found for the given criteria" },
        { status: 404 }
      );
    }

    //? Format as StudentResult[] for consistency with the frontend
    const updatedResult: StudentResult[] = response.documents.map((result) => ({
      student_id: result.student_id.toUpperCase().trim(),
      name: result.name,
      cgpa: result.cgpa.toString(),
      total_credit: result.total_credit.toString(),
      has_backlogs: result.has_backlogs,
      backlogs: result.backlogs || "",
      semester: result.semester.trim(),
      year: result.year.trim(),
      academic_session: result.academic_session.trim(),
      grade: result.grade,
    }));

    return NextResponse.json({
      results: updatedResult,
    });
  } catch (error) {
    console.error("Error processing result for edit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

//* PUT method to update results
export const PUT = async (req: NextRequest) => {
  const { results }: { results: StudentResult[] } = await req.json();

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

  if (!Array.isArray(results) || results.length === 0) {
    return NextResponse.json(
      { error: "No results provided for update" },
      { status: 400 }
    );
  }

  try {
    const existingResult = await db.listDocuments(
      DATABASE_ID,
      RESULTS_COLLECTION_ID,
      [
        Query.equal("student_id", results[0].student_id.trim().toUpperCase()),
        Query.equal("academic_session", results[0].academic_session.trim()),
        Query.equal("year", results[0].year.trim()),
        Query.equal("semester", results[0].semester.trim()),
      ]
    );

    if (existingResult.documents.length === 0) {
      return NextResponse.json(
        { error: "No results found for the given criteria" },
        { status: 404 }
      );
    }

    const result_id = existingResult.documents[0].$id;

    //? Extract and sanitize the updated result
    const updatedResult: StudentResult = {
      ...results[0],
      student_id: results[0].student_id.trim().toUpperCase(),
      semester: results[0].semester.trim(),
      year: results[0].year.trim(),
      academic_session: results[0].academic_session.trim(),
    };

    //? Update result document
    const updatedDocument = await db.updateDocument(
      DATABASE_ID,
      RESULTS_COLLECTION_ID,
      result_id,
      updatedResult
    );

    if (!updatedDocument) {
      return NextResponse.json(
        { error: "Failed to update results" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Results updated successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating results:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
