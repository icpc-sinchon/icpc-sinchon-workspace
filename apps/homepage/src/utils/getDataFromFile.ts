import path from "node:path";
import fs from "node:fs";

type DataType = "campContest" | "campHistory" | "hallOfFame" | "suapc";

export function getDataFromFile(
  dataType: DataType,
  year: number,
  season: string,
) {
  const filename = `${year} ${season}.json`;
  const dataDirectory = path.join(
    process.cwd(),
    "..",
    "..",
    "libs",
    "data",
    dataType,
  );
  const data = fs.readFileSync(path.join(dataDirectory, filename), "utf8");
  return JSON.parse(data);
}
