import { db, validateJwt } from "@/appwrite/appwrite-server";
import { StudentResult } from "@/types/resultType";
import { ID, Models, Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const RESULTS_COLLECTION_ID = process.env.APPWRITE_RESULTS_COLLECTION_ID!;

export const POST = async (req: NextRequest) => {
  const { results } = await req.json();

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
      { error: "Invalid results data" },
      { status: 400 }
    );
  }

  //   //? Trim all string fields in the results array
  const trimString = (s: string) => s.trim();

  const trimmedResults: StudentResult[] = results.map((r) => ({
    ...r,
    student_id: trimString(r.student_id),
    semester: trimString(r.semester),
    year: trimString(r.year),
    academic_session: trimString(r.academic_session),
  }));

  try {
    const created: Models.Document[] = [];
    const failed: StudentResult[] = [];
    const existingResults: Models.Document[] = [];

    const promises = trimmedResults.map(async (r) => {
      try {
        const existingResult = await db.listDocuments(
          DATABASE_ID,
          RESULTS_COLLECTION_ID,
          [
            Query.equal("student_id", r.student_id),
            Query.equal("academic_session", r.academic_session),
            Query.equal("year", r.year),
            Query.equal("semester", r.semester),
          ]
        );

        const documents = existingResult?.documents;

        if (documents.length === 0 || !documents[0]) {
          //? No existing result found, create a new one
          try {
            const createdResult = await db.createDocument(
              DATABASE_ID,
              RESULTS_COLLECTION_ID,
              ID.unique(),
              r
            );

            if (!createdResult) {
              console.error("❌ Failed to create result for ", r.student_id);
              failed.push(r);
            } else {
              created.push(createdResult);
              console.log("✅ Created result for ", createdResult.student_id);
            }
          } catch (error) {
            console.error("Error creating new result: ", error);
          }
        } else {
          //? If an existing result is found, add it to the existingResults array
          existingResults.push(documents[0]);
        }
      } catch (error) {
        console.error("Error checking duplicate result data: ", error);
      }
    });

    await Promise.all(promises);

    console.log({
      message: "Results processing summary",
      created: created.length,
      failed: failed.length,
      existingResults: existingResults.length,
      totalResults: trimmedResults.length,
    });

    return NextResponse.json({
      message: "Results published successfully",
      created: created.length,
      failed: failed.length,
      existingResults: existingResults.length,
    });
  } catch (error) {
    console.error("Error publishing results:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
