export const generateEmailFromId = (id: string): string | undefined => {
  if (id === "ADMIN") {
    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return email;
  }

  //? Assuming the email format is id@mbstu.ac.bd
  return `${id.trim().toLowerCase()}@mbstu.ac.bd`;
};
