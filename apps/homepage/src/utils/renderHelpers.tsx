import Link from "next/link";

export function renderLink({ title, url }: { title: string; url: string }) {
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

export function renderPerson(person: { bojHandle: string }) {
  return {
    ...person,
    bojHandle: renderLink({
      title: person.bojHandle,
      url: `https://www.acmicpc.net/user/${person.bojHandle}`,
    }),
  };
}
