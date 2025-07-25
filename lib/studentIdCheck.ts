import z from "zod";

export const studentIdCheck = z.string().regex(/^ME\d{5,}$/, {
  message: "Must be a valid ME department ID",
});
