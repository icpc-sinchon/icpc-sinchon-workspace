import type { Semester } from "src/types";

export function getSemesterFromString(semesterString: string): Semester {
  const [currentYear, currentSeason] = semesterString.split("-");
  const currentSemester = {
    year: Number.parseInt(currentYear),
    season: currentSeason,
  } as Semester;
  return currentSemester;
}
