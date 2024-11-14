import path from "node:path";
import fs from "node:fs";
import type { Semester } from "src/types";

// 존재하는 모든 학기들의 정보를 가져온다
export function getAllSemesterRouters(): Semester[] {
  const dataDirectory = path.join(
    process.cwd(),
    "..",
    "..",
    "libs",
    "data",
    "semester.json",
  );
  const data = JSON.parse(fs.readFileSync(dataDirectory, "utf-8"));
  return data.semesters;
}
