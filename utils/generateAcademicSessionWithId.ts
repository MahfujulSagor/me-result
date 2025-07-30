export const generateAcademicSession = (student_id: string): string | null => {
  const match = student_id.match(/^ME(\d{2})\d{3}$/);
  if (!match) {
    console.error("Invalid student ID format:", student_id);
    return null;
  }

  const admissionYear = parseInt(match[1], 10); //? e.g., 24 → 2024
  const fullYear = 2000 + admissionYear; //? Assume all years are 2000+

  const start = fullYear - 1;
  const end = fullYear;

  return `${start}-${end}`;
};
