import path from "node:path";
import fs from "node:fs";
import type { Semester } from "src/types";

export function getCurrentSemester() {
  const dataDirectory = path.join(
    process.cwd(),
    "..",
    "..",
    "libs",
    "data",
    "currentSemester.json",
  );
  const data = fs.readFileSync(dataDirectory, "utf8");
  return JSON.parse(data) as Semester;
}
