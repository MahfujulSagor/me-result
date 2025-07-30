export const runtime = "nodejs";

import { account, db } from "@/appwrite/appwrite-server";
import { generateAcademicSession } from "@/utils/generateAcademicSessionWithId";
import { userSchema } from "@/lib/userSchema";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const STUDENTS_COLLECTION_ID = process.env.APPWRITE_STUDENTS_COLLECTION_ID!;

export const POST = async (req: NextRequest) => {
  //? Username is expected to be in the format "ME24034" which is the student ID
  const {
    email,
    username,
    password,
  }: { email: string; username: string; password: string } = await req.json();

  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const validationResult = userSchema.safeParse({
    username: username,
    email: email,
    password: password,
  });

  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.errors[0].message },
      { status: 400 }
    );
  }

  const session = generateAcademicSession(username);

  try {
    const studentAccount = await account.create(
      ID.unique(),
      email.trim().toLowerCase(),
      password,
      username.trim().toUpperCase()
    );

    if (!studentAccount) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    console.log("User account created successfully:", studentAccount);

    const student = await db.createDocument(
      DATABASE_ID,
      STUDENTS_COLLECTION_ID,
      ID.unique(),
      {
        student_email: email.trim().toLowerCase(),
        student_id: username.trim().toUpperCase(),
        academic_session: session,
      }
    );

    if (!student) {
      return NextResponse.json(
        { error: "Failed to create student document" },
        { status: 500 }
      );
    }

    console.log("Student document created successfully:", student);

    const { academic_session, student_id } = student;

    return NextResponse.json(
      {
        academic_session,
        student_id,
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
