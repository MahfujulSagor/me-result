export const generateEmailFromId = (id: string): string => {
  // Assuming the email format is id@mbstu.ac.bd
  return `${id.trim().toLowerCase()}@mbstu.ac.bd`;
};
