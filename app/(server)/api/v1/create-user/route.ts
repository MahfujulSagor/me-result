import { db } from "@/appwrite/appwrite-server";
import { generateAcademicSession } from "@/lib/generateAcademicSessionWithId";
import { studentIdCheck } from "@/lib/studentIdCheck";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const STUDENTS_COLLECTION_ID = process.env.APPWRITE_STUDENTS_COLLECTION_ID!;

export const POST = async (req: NextRequest) => {
  const { email, username } = await req.json();

  if (!email || !username) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const result = studentIdCheck.safeParse(username);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0].message }, //? returns "Must be a valid ME department ID"
      { status: 400 }
    );
  }

  const session = generateAcademicSession(username);

  try {
    const student = await db.createDocument(
      DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      ID.unique(),
      {
        student_email: email,
        student_id: username,
        academic_session: session,
      }
    );

    const { student_email, student_id, academic_session } = student;

    return NextResponse.json(
      {
        student_email,
        student_id,
        academic_session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating user", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
