import path from "node:path";
import fs from "node:fs";
import type { Semester } from "src/types";

export function getCurrentSemester(): Semester {
  const dataDirectory = path.join(
    process.cwd(),
    "..",
    "..",
    "libs",
    "data",
    "semester.json",
  );
  const data = JSON.parse(fs.readFileSync(dataDirectory, "utf-8"));
  return data.currentSemester;
}
