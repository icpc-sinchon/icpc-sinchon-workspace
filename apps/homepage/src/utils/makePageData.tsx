import type { DataType, Semester } from "src/types";
import { getAllSemesterRouters } from "./getAllSemesterRouters";
import { notFound } from "next/navigation";
import { getDataFromFile } from "./getDataFromFile";
import { renderPageData } from "./renderPageData";

export function makePageData<T extends DataType>(
  semester: Semester,
  dataType: T,
) {
  const allDataRouters = getAllSemesterRouters();
  // tab Nav에서 선택되어 있을 탭의 인덱스를 찾는다
  const selectedTabIndex = allDataRouters.findIndex(
    (s) => s.year === semester.year && s.season === semester.season,
  );

  if (selectedTabIndex === -1) {
    notFound();
  }

  const rawPageData = getDataFromFile(dataType, semester.year, semester.season);
  const renderedPageData = renderPageData<T>({ dataType, data: rawPageData });

  return {
    allDataRouters,
    selectedTabIndex,
    renderedPageData,
  };
}
