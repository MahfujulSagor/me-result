import z from "zod";

export const userLoginSchema = z.object({
  username: z.string().regex(/^ME\d{5,}$/i, {
    message: "Must be a valid ME department ID",
  }),
  password: z.string().min(8, "Must be at least 8 characters long"),
});
