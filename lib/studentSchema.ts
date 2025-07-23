import z from "zod";

export const studentSchema = z
  .object({
    studentID: z.string().regex(/^ME\d{5,}$/, {
      message: "Must be a valid ME student ID",
    }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Must be at least 8 characters long"),
  })
  .superRefine((data, ctx) => {
    const { email } = data;

    if (
      !email.endsWith("@mbstu.ac.bd") ||
      !email.split("@")[0].toUpperCase().startsWith("ME")
    ) {
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: "Must be a valid ME student email",
      });
    }

    // ?Match email prefix with studentID
    const emailPrefix = email.split("@")[0].toUpperCase();
    const id = data.studentID.toUpperCase();

    if (emailPrefix !== id) {
      ctx.addIssue({
        path: ["studentID"],
        code: z.ZodIssueCode.custom,
        message: "Student ID must match the email prefix",
      });
    }
  });
