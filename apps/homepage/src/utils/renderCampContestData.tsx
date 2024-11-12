import { ElementType } from "react";
import type { CampContest } from "src/types/campContest";

const renderBojHandle = (bojHandle: string) => (
  <a
    href={`https://www.acmicpc.net/user/${bojHandle}`}
    target="_blank"
    rel="noreferrer"
    style={{ color: "black" }}
    key={bojHandle}
  >
    {bojHandle}
  </a>
);

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
    link: (
      <a
        href={problem.link}
        target="_blank"
        rel="noreferrer"
        style={{ color: "black" }}
      >
        {problem.problemTitle}
      </a>
    ),
    setter: (
      <a
        href={`https://www.acmicpc.net/user/${problem.setter.bojHandle}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: "black" }}
      >
        {problem.setter.name}
      </a>
    ),
    setterSchool: problem.setter.school,
  };
};

export const renderCampContestData = (data: CampContest) => {
  const renderData = {
    ...data,
    contest: data.contest?.map((contest) => ({
      ...contest,
      problemPicker: contest.problemPicker?.map((picker) => ({
        ...picker,
        bojHandle: renderBojHandle(picker.bojHandle),
      })),
      awards: contest.awards?.map((award) => ({
        ...award,
        rank: renderRank(award.rank),
        bojHandle: renderBojHandle(award.bojHandle),
      })),
      problemList: contest.problemList?.map((problem) =>
        renderProblem(problem),
      ),
    })),
  };
  return renderData;
};
