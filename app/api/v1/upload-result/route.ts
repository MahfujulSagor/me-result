// import { db } from "@/lib/appwrite-server";
// import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

// const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
// const RESULTS_COLLECTION_ID = process.env.APPWRITE_RESULTS_COLLECTION_ID!;
// const STUDENTS_COLLECTION_ID = process.env.APPWRITE_STUDENTS_COLLECTION_ID!;

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const semester = formData.get("semester") as string;
  const year = formData.get("year") as string;
  const session = formData.get("Session") as string;

  if (!file || !semester || !year || !session) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    for (const rowRaw of json) {
      const row = rowRaw as Record<string, string | number | boolean | null>;

      const headers = Object.keys(row);

      const studentIdKey = headers.find((k) =>
        k.toLowerCase().includes("student id")
      );
      const cgpaKey = headers.find((k) => k.toLowerCase().includes("gpa"));
      const totalCreditKey = headers.find((k) =>
        k.toLowerCase().includes("credit earned")
      );
      const backlogsKey = headers.find((k) =>
        k.toLowerCase().includes("lost credit")
      );
      const gradeKey = headers.find((k) => k.toLowerCase().includes("result"));

      if (!studentIdKey || !cgpaKey || !totalCreditKey) continue;

      const studentId = row[studentIdKey];
      const cgpa = row[cgpaKey];
      const totalCredit = row[totalCreditKey];
      const rawBacklogs = backlogsKey ? row[backlogsKey] : "";
      const grade = gradeKey ? row[gradeKey] : "";

      if (!studentId || !cgpa || !totalCredit) continue;

      let backlogs = "";

      if (typeof rawBacklogs === "string" && rawBacklogs.includes("(")) {
        const matches = rawBacklogs.match(/([\d.]+)\(([^)]+)\)/g);
        if (matches) {
          const parsed = matches.map((entry) => {
            const [, credit, course] = entry.match(/([\d.]+)\(([^)]+)\)/)!;
            return { course, credit_lost: parseFloat(credit) };
          });
          backlogs = JSON.stringify(parsed);
        }
      }

      // await db.createDocument(DATABASE_ID, RESULTS_COLLECTION_ID, ID.unique(), {
      //   student_id: studentId,
      //   cgpa: cgpa.toString(),
      //   total_credit: totalCredit.toString(),
      //   backlogs: backlogs || "",
      //   semester,
      //   year,
      //   session,
      //   grade,
      // });

      const result = {
        student_id: studentId,
        cgpa: cgpa.toString(),
        total_credit: totalCredit.toString(),
        backlogs: backlogs || "",
        semester,
        year,
        session,
        grade,
      };

      // const result = await db.createDocument(
      //   DATABASE_ID,
      //   RESULTS_COLLECTION_ID,
      //   ID.unique(),
      //   {
      //     student_id: studentId,
      //     cgpa: cgpa.toString(),
      //     total_credit: totalCredit.toString(),
      //     backlogs: backlogs || "",
      //     semester,
      //     year,
      //     session,
      //     grade,
      //   }
      // );

      console.log("Uploaded result for student:", studentId, result);
    }

    return NextResponse.json(
      { message: "Results uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading results:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
