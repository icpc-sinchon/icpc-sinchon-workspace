import type { SUAPCData } from "src/types/suapc";
import { renderPerson, renderProblem, renderRank } from "./renderHelpers";

export const renderSuapcData = (data: SUAPCData) => {
  const renderData = {
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
  return renderData;
};
