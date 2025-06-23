import { z } from "zod";

export const uploadSchema = z.object({
  semester: z.string().min(1).max(1).nonempty("Semester can't be empty"),
  year: z.string().min(1).max(1).nonempty("Year is required"),
  session: z.string().min(9).max(9).nonempty("Session is required"),
  result: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].includes(file.type),
      {
        message: ".xlsx files are allowed",
      }
    ),
});
