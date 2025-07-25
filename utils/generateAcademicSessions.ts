import { Session } from "@/types/sessionType";

const START_YEAR: number = 2023;

export const generateSessions = (): Session[] => {
  const currentYear = new Date().getFullYear();
  const totalSessions = currentYear - START_YEAR; // include next year's batch
  const sessions: Session[] = [];

  for (let i = 0; i < totalSessions; i++) {
    const from = START_YEAR + i;
    const to = from + 1;
    const label = `${from}-${to}`;
    sessions.push({ value: label, label });
  }

  return sessions;
};
