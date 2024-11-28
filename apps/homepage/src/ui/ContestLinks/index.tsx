import * as styles from "./styles.css";
import LinkButton from "@components/LinkButton";

type Props = {
  links: {
    title: string;
    href: string;
  }[];
};

function ContestLinks({ links }: Props) {
  return (
    <nav className={styles.container} aria-label="콘테스트 관련 링크 목록">
      {links.map((link) => (
        <LinkButton
          key={`${link.title}-${link.href}`}
          href={link.href}
          disabled={!link.href}
        >
          {link.title}
        </LinkButton>
      ))}
    </nav>
  );
}

export default ContestLinks;
