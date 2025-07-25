import { z } from "zod";

export const resultFormSchema = z.object({
  semester: z.string().min(1).max(1).nonempty("Semester is required"),
  year: z.string().min(1).max(1).nonempty("Year is required"),
});
