import z from "zod";

export const userLoginSchema = z.object({
  username: z
    .string()
    .refine((val) => /^ME\d{5,}$/i.test(val) || val.toUpperCase() === "ADMIN", {
      message: "Must be a valid ID",
    }),
  password: z.string().min(8, "Must be at least 8 characters long"),
});
