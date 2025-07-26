import z from "zod";

export const userSchema = z
  .object({
    username: z.string().regex(/^ME\d{5,}$/i, {
      message: "Must be a valid ME department ID",
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
        message: "Must be a valid ME department email",
      });
    }

    const emailPrefix = email.split("@")[0].toUpperCase();
    const id = data.username.toUpperCase();

    if (emailPrefix !== id) {
      ctx.addIssue({
        path: ["username"],
        code: z.ZodIssueCode.custom,
        message: "username must match the email prefix",
      });
    }
  });
