import { Season, Semester } from "@prisma/client";

export class SemesterEntity implements Semester {
  id: number;
  year: number;
  season: Season;
}
