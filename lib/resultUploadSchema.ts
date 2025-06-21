import { z } from "zod";

export const uploadSchema = z.object({
  semester: z.string().min(1).max(1).nonempty("Semester can't be empty"),
  year: z.string().min(4).max(4).nonempty("Year must be 4 digits"),
  result: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/png",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].includes(file.type),
      {
        message: "Only .jpg, .png or .xlsx files are allowed",
      }
    ),
});
