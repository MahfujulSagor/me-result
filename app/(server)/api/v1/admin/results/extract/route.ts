import { validateJwt } from "@/appwrite/appwrite-server";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID!;

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const session_token = req.cookies.get("session_token")?.value;
  if (!session_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await validateJwt(session_token);
  if (!user || user.$id !== ADMIN_USER_ID) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

    const parsedResults = [];

    for (const rowRaw of json) {
      const row = rowRaw as Record<string, string | number | boolean | null>;

      const headers = Object.keys(row);
      const studentIdKey = headers.find((k) =>
        k.toLowerCase().includes("student id")
      );
      const studentNameKey = headers.find((k) =>
        k.toLowerCase().includes("name")
      );
      const cgpaKey = headers.find((k) => k.toLowerCase().includes("gpa"));
      const totalCreditKey = headers.find((k) =>
        k.toLowerCase().includes("credit earned")
      );
      const backlogsKey = headers.find((k) =>
        k.toLowerCase().includes("lost credit")
      );
      const gradeKey = headers.find((k) => k.toLowerCase().includes("result"));

      if (!studentIdKey || !studentNameKey || !cgpaKey || !totalCreditKey)
        continue;

      const studentId = row[studentIdKey] as string;
      const studentName = row[studentNameKey] as string;
      const cgpa = row[cgpaKey] as string;
      const totalCredit = row[totalCreditKey] as string;
      const rawBacklogs = backlogsKey ? (row[backlogsKey] as string) : "";
      const grade = gradeKey ? (row[gradeKey] as string) : "";

      if (!studentId || !cgpa || !totalCredit || !studentName) continue;

      let backlogs = "";
      let has_backlogs = false;

      if (typeof rawBacklogs === "string" && rawBacklogs.includes("(")) {
        const matches = rawBacklogs.match(/([\d.]+)\(([^)]+)\)/g);
        if (matches) {
          has_backlogs = true;
          const parsed = matches.map((entry) => {
            const [, credit, course] = entry.match(/([\d.]+)\(([^)]+)\)/)!;
            return { course, credit_lost: parseFloat(credit) };
          });
          backlogs = JSON.stringify(parsed);
        }
      }

      parsedResults.push({
        student_id: studentId.toLocaleUpperCase().trim(),
        name: studentName,
        cgpa: cgpa.toString(),
        total_credit: totalCredit.toString(),
        has_backlogs,
        backlogs: backlogs || "",
        semester: semester.trim(),
        year: year.trim(),
        academic_session: session.trim(),
        grade,
      });
    }

    return NextResponse.json({ results: parsedResults }, { status: 200 });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract results" },
      { status: 500 }
    );
  }
};
