import type { DataType, Semester } from "src/types";
import type { CampContest } from "src/types/campContest";
import type { CampHistory } from "src/types/campHistory";
import type { HallOfFame } from "src/types/hallOfFame";
import type { SUAPCData } from "src/types/suapc";

const makeCampContestData = (semester: Semester): CampContest => {
  return {
    ...semester,
    dateTime: `아직 ${semester.year} ${semester.season} 시즌이 진행되지 않았습니다. 역대 캠프 정보는 상단의 탭을 참고해주세요.`,
    links: {},
    contest: [],
  };
};

const makeCampHistoryData = (semester: Semester): CampHistory => {
  return {
    ...semester,
    study: [],
  };
};

const makeHallOfFameData = (semester: Semester): HallOfFame => {
  return {
    ...semester,
    duration: `아직 ${semester.year} ${semester.season} 시즌이 진행되지 않았습니다. 역대 캠프 정보는 상단의 탭을 참고해주세요.`,
    manager: [],
    campContributor: [],
  };
};

const makeSUAPCData = (semester: Semester): SUAPCData => {
  return {
    ...semester,
    dateTime: `아직 ${semester.year} ${semester.season} 시즌이 진행되지 않았습니다. 역대 캠프 정보는 상단의 탭을 참고해주세요.`,
    links: {},
    contest: [],
    setter: [],
    reviewer: [],
    sponsor: [],
  };
};

export function makeDefaultPageData<T extends DataType>(
  semester: Semester,
  dataType: T,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): any {
  switch (dataType) {
    case "campContest":
      return makeCampContestData(semester);
    case "campHistory":
      return makeCampHistoryData(semester);
    case "hallOfFame":
      return makeHallOfFameData(semester);
    case "suapc":
      return makeSUAPCData(semester);
  }
}
