import path from "node:path";
import fs from "node:fs";
import { formatFilenames } from "./formatFilenames";
import type { DataType, Semester } from "src/types";

// 학기를 정렬하는 기능 추가
export function getAllSemesterRouters(dataType: DataType): Semester[] {
  const dataDirectory = path.join(
    process.cwd(),
    "..",
    "..",
    "libs",
    "data",
    dataType,
  );
  const data = fs.readdirSync(path.join(dataDirectory), "utf8");
  const formattedData = formatFilenames(data);
  const sortedData = formattedData.sort((a, b) => {
    const [yearA, seasonA] = a.split("-");
    const [yearB, seasonB] = b.split("-");

    // 최신 연도부터 정렬
    if (yearA !== yearB) {
      return Number.parseInt(yearB, 10) - Number.parseInt(yearA, 10);
    }

    // 연도가 같을 경우 Winter가 먼저 오도록 정렬
    if (seasonA === "Winter" && seasonB === "Summer") return 1;
    if (seasonA === "Summer" && seasonB === "Winter") return -1;

    return 0;
  });
  const result = sortedData.map((semester) => {
    const [year, season] = semester.split("-");
    return {
      year: Number.parseInt(year, 10),
      season,
    } as Semester;
  });

  return result;
}
