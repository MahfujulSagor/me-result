import { z } from "zod";

export const editResultSchema = z.object({
  student_id: z.string().regex(/^ME\d{5,}$/i, {
    message: "Must be a valid ME department student ID",
  }),
  semester: z.string().min(1).max(1).nonempty("Semester can't be empty"),
  year: z.string().min(1).max(1).nonempty("Year is required"),
  academic_session: z.string().min(9).max(9).nonempty("Session is required"),
});
