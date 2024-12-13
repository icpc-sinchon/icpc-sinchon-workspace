import type { DataType, Semester } from "src/types";
import { getAllSemesterRouters } from "./getAllSemesterRouters";
import { notFound } from "next/navigation";
import { getDataFromFile } from "./getDataFromFile";
import { renderPageData } from "./renderPageData";
import path from "node:path";
import fs from "node:fs";
import { makeDefaultPageData } from "./defaultPagedata";

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

export function makePageData<T extends DataType>(
  semester: Semester,
  dataType: T,
) {
  const allDataRouters = getAllSemesterRouters();

  // tab Nav에서 선택되어 있을 탭의 인덱스를 찾는다
  const selectedTabIndex = allDataRouters.findIndex(
    (s) => s.year === semester.year && s.season === semester.season,
  );

  // 만약 주어진 학기의 데이터가 아예 학기 목록에 존재하지 않으면 not found
  if (selectedTabIndex === -1) {
    notFound();
  }

  // 만약 주어진 학기의 데이터 파일이 존재하지 않으면 default 페이지 데이터 반환
  if (!checkDataFileExistence(dataType, semester.year, semester.season)) {
    const rawPageData = makeDefaultPageData(semester, dataType);
    const renderedPageData = renderPageData<T>({ dataType, data: rawPageData });

    return {
      allDataRouters,
      selectedTabIndex,
      renderedPageData,
    };
  }

  const rawPageData = getDataFromFile(dataType, semester.year, semester.season);
  const renderedPageData = renderPageData<T>({ dataType, data: rawPageData });

  return {
    allDataRouters,
    selectedTabIndex,
    renderedPageData,
  };
}
