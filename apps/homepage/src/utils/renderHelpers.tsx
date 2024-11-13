import Link from "next/link";

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

export function renderPerson<T extends { bojHandle: string }>(person: T) {
  return {
    ...person,
    bojHandle: renderLink({
      title: person.bojHandle,
      url: `https://www.acmicpc.net/user/${person.bojHandle}`,
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
