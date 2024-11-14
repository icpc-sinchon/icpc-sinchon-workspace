import type { CampContest } from "src/types/campContest";
import { renderPerson, renderRank, renderProblem } from "./renderHelpers";

export const renderCampContestData = (data: CampContest) => {
  const renderData = {
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
      problemList: contest.problemList?.map((problem) =>
        renderProblem(problem),
      ),
    })),
  };
  return renderData;
};
