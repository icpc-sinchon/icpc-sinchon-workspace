import type { CampContest } from "src/types/campContest";
import type { CampHistory } from "src/types/campHistory";
import type { HallOfFame } from "src/types/hallOfFame";
import type { SUAPCData } from "src/types/suapc";
import { renderPerson, renderRank, renderProblem } from "./renderHelpers";
import type { DataType } from "src/types";

type DataTypeToData = {
  campContest: CampContest;
  campHistory: CampHistory;
  hallOfFame: HallOfFame;
  suapc: SUAPCData;
};

// 데이터 타입별 렌더링 결과 타입 매핑
type DataTypeToRenderedData = {
  campContest: ReturnType<typeof renderCampContestData>;
  campHistory: ReturnType<typeof renderCampHistoryData>;
  hallOfFame: ReturnType<typeof renderHallOfFameData>;
  suapc: ReturnType<typeof renderSUAPCData>;
};

// DataType과 같아야 한다
type RenderInput = {
  [K in DataType]: {
    dataType: K;
    data: DataTypeToData[K];
  };
}[DataType];

export function renderPageData<T extends DataType>({
  dataType,
  data,
}: RenderInput): DataTypeToRenderedData[T] {
  switch (dataType) {
    case "campContest":
      return renderCampContestData(data) as DataTypeToRenderedData[T];

    case "campHistory":
      return renderCampHistoryData(data) as DataTypeToRenderedData[T];

    case "hallOfFame":
      return renderHallOfFameData(data) as DataTypeToRenderedData[T];

    case "suapc":
      return renderSUAPCData(data) as DataTypeToRenderedData[T];
  }
}

function renderCampContestData(data: CampContest) {
  return {
    ...data,
    contest: data.contest?.map((contest) => ({
      ...contest,
      problemPicker: contest.problemPicker?.map(renderPerson),
      awards: contest.awards
        ?.map((award) => ({
          ...award,
          rank: renderRank(award.rank),
        }))
        .map(renderPerson),
      problemList: contest.problemList?.map(renderProblem),
    })),
  };
}

function renderCampHistoryData(data: CampHistory) {
  return {
    ...data,
    study: data.study.map((s) => ({
      ...s,
      lecturer: s.lecturer.map(renderPerson),
      mentor: s.mentor?.map(renderPerson),
    })),
  };
}

function renderHallOfFameData(data: HallOfFame) {
  return {
    ...data,
    campContributor: data.campContributor.map((contributor) => ({
      level: contributor.level,
      lecturer: contributor.lecturer.map(renderPerson),
      mentor: contributor.mentor?.map(renderPerson),
    })),
  };
}

function renderSUAPCData(data: SUAPCData) {
  return {
    ...data,
    contest: data.contest?.map((contest) => ({
      ...contest,
      awards: contest.awards?.map((award) => ({
        ...award,
        rank: renderRank(award.rank),
      })),
      problemList: contest.problemList?.map(renderProblem),
    })),
    setter: data.setter?.map(renderPerson),
    reviewer: data.reviewer?.map(renderPerson),
  };
}
