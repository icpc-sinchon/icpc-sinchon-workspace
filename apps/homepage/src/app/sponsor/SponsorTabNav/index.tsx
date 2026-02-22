import Link from "next/link";
import * as styles from "./styles.css";

function SponsorTabNav({
  tabs,
  currentTabIndex,
}: {
  tabs: { title: string; url: string }[];
  currentTabIndex: number;
}) {
  return (
    <nav className={styles.tabNavWrap}>
      <ul className={styles.tabNav}>
        {tabs.map((tab, index) => (
          <li
            key={tab.url}
            className={
              styles.tabNavItem[
                index === currentTabIndex ? "selected" : "unselected"
              ]
            }
          >
            <Link href={tab.url} className={styles.tabNavItemLink}>
              {tab.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SponsorTabNav;
