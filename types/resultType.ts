export type Backlog = {
  course: string;
  credit_lost: string;
};

export type StudentResult = {
  year: string;
  semester: string;
  academic_session: string;
  cgpa: string;
  total_credit: string;
  backlogs: string; //* JSON stringified
  student_id: string;
  grade: string;
  has_backlogs: boolean;
  name: string;
};
