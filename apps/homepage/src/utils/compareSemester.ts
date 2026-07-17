import type { Semester } from "src/types";

// 같은 해에서는 Winter(2월)가 Summer(8월)보다 앞선다
const seasonOrder: Record<Semester["season"], number> = {
  Winter: 0,
  Summer: 1,
};

// a가 b보다 이르면 음수, 같으면 0, 늦으면 양수
export function compareSemester(a: Semester, b: Semester) {
  if (a.year !== b.year) {
    return a.year - b.year;
  }
  return seasonOrder[a.season] - seasonOrder[b.season];
}
