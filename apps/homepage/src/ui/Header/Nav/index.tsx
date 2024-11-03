import Link from "next/link";
import type { Category } from "..";
import * as styles from "./styles.css";

function Nav({ categories }: { categories: Category[] }) {
  return (
    <nav className={styles.nav}>
      {categories.map((category) => (
        <Link
          key={category.url}
          href={category.url}
          passHref
          className={styles.navLink}
        >
          {category.title}
        </Link>
      ))}
    </nav>
  );
}

export default Nav;
