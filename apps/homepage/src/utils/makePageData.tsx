import type { DataType, Semester } from "src/types";
import { getAllSemesterRouters } from "./getAllSemesterRouters";
import { notFound } from "next/navigation";
import { getDataFromFile } from "./getDataFromFile";
import { renderPageData } from "./renderPageData";
import path from "node:path";
import fs from "node:fs";

// 파일의 존재 여부 체크
function checkDataFileExistence(
  dataType: DataType,
  year: number,
  season: string,
) {
  const filename = `${year}-${season}.json`;
  const dataDirectory = path.join(
    process.cwd(),
    "..",
    "..",
    "libs",
    "data",
    dataType,
  );

  return fs.existsSync(path.join(dataDirectory, filename));
}

function makeDefaultPageData(dataType: DataType, year: number, season: string) {
  if (dataType === "hallOfFame") {
    return {
      year,
      season,
      dateTime: `아직 ${year}년 ${season} 캠프 콘테스트 일자가 정해지지 않았습니다.`,
      note: "",
      links: {},
      contest: [],
    };
  }
}

export function makePageData<T extends DataType>(
  semester: Semester,
  dataType: T,
) {
  const allDataRouters = getAllSemesterRouters();

  const existingDataRouters = allDataRouters.filter((s) =>
    checkDataFileExistence(dataType, s.year, s.season),
  );

  // tab Nav에서 선택되어 있을 탭의 인덱스를 찾는다
  const selectedTabIndex = existingDataRouters.findIndex(
    (s) => s.year === semester.year && s.season === semester.season,
  );

  if (selectedTabIndex === -1) {
    notFound();
  }

  const rawPageData = getDataFromFile(dataType, semester.year, semester.season);
  const renderedPageData = renderPageData<T>({ dataType, data: rawPageData });

  return {
    allDataRouters: existingDataRouters,
    selectedTabIndex,
    renderedPageData,
  };
}
