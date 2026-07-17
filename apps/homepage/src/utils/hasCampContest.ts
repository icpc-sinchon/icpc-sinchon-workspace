import type { Semester } from "src/types";
import { compareSemester } from "./compareSemester";

// Camp Contest는 이 시즌을 마지막으로 더 이상 열리지 않는다.
// 다시 열게 되면 이 값을 그 시즌으로 옮기고 데이터 파일을 추가한다.
const lastCampContestSemester: Semester = { year: 2023, season: "Summer" };

export function hasCampContest(semester: Semester) {
  return compareSemester(semester, lastCampContestSemester) <= 0;
}
