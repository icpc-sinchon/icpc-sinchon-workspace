import type { CampContest } from "src/types/campContest";
import { renderLink, renderPerson } from "./renderHelpers";

const renderRank = (rank: number) => {
  if (rank === 1) {
    return "1 🥇";
  }
  if (rank === 2) {
    return "2 🥈";
  }
  if (rank === 3) {
    return "3 🥉";
  }
  return rank;
};

type Problem = NonNullable<
  NonNullable<CampContest["contest"]>[number]["problemList"]
>[number];

const renderProblem = (problem: Problem) => {
  return {
    ...problem,
    link: renderLink({
      title: problem.problemTitle,
      url: problem.link,
    }),
    setter: renderLink({
      title: problem.setter.name,
      url: `https://www.acmicpc.net/user/${problem.setter.bojHandle}`,
    }),
    setterSchool: problem.setter.school,
  };
};

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
