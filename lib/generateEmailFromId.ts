export const generateEmailFromId = (id: string): string | null => {
  if (!id || typeof id !== "string") {
    return null;
  }

  if (id === "admin") {
    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL as string;
    return email;
  }
  //? Assuming the email format is id@mbstu.ac.bd
  return `${id.trim().toLowerCase()}@mbstu.ac.bd`;
};
