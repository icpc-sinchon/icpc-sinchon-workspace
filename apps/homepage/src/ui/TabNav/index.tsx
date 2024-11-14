import Link from "next/link";
import * as styles from "./styles.css";

function TabNavItem({
  tabURL,
  tabTitle,
  selected,
}: { tabURL: string; tabTitle: string; selected: boolean }) {
  return (
    <li className={styles.tabNavItem[selected ? "selected" : "unselected"]}>
      <Link href={tabURL} className={styles.tabNavItemLink}>
        {tabTitle}
      </Link>
    </li>
  );
}

// TODO: 모바일 환경 tab nav에서 양쪽 화살표를 통해 스크롤임을 표시
function TabNav<T extends object>({
  tabList,
  currentTabIndex,
  makeTabURL,
  makeTabTitle,
}: {
  tabList: T[];
  currentTabIndex: number;
  makeTabURL: (tabInfo: T) => string;
  makeTabTitle: (tabInfo: T) => string;
}) {
  return (
    <nav className={styles.tabNavWrap}>
      <ul className={styles.tabNav}>
        {tabList.map((tabInfo, index) => {
          return (
            <TabNavItem
              key={makeTabURL(tabInfo)}
              tabURL={makeTabURL(tabInfo)}
              tabTitle={makeTabTitle(tabInfo)}
              selected={index === currentTabIndex}
            />
          );
        })}
      </ul>
    </nav>
  );
}

export default TabNav;
