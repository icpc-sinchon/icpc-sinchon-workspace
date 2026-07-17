import Link from "next/link";
import type { Problem } from "src/types";

export function renderLink({
  title,
  url,
}: { title: string; url: string }): React.ReactNode {
  return (
    <Link
      target="_blank"
      href={url}
      style={{ color: "black" }}
      rel="noopener noreferrer"
    >
      {title}
    </Link>
  );
}

// solved.ac는 BOJ 핸들을 그대로 쓰므로 모든 시즌에 동일하게 적용된다
function makeHandleURL(handle: string) {
  return `https://solved.ac/profile/${handle}`;
}

export function renderPerson<T extends { bojHandle: string }>(person: T) {
  return {
    ...person,
    bojHandle: renderLink({
      title: person.bojHandle,
      url: makeHandleURL(person.bojHandle),
    }),
  };
}

export function renderRank(rank: number) {
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
}

export const renderProblem = (problem: Problem) => {
  return {
    ...problem,
    link: renderLink({
      title: problem.problemTitle,
      url: problem.link,
    }),
    setter: renderLink({
      title: problem.setter.name,
      url: makeHandleURL(problem.setter.bojHandle),
    }),
    setterSchool: problem.setter.school,
  };
};
