"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as styles from "./styles.css";

type TabNavClientItem = {
  tabURL: string;
  tabTitle: string;
  selected: boolean;
};

function TabNavItem({
  tabURL,
  tabTitle,
  selected,
}: TabNavClientItem) {
  return (
    <li className={styles.tabNavItem[selected ? "selected" : "unselected"]}>
      <Link href={tabURL} className={styles.tabNavItemLink}>{tabTitle}</Link>
    </li>
  );
}

function TabNavClient({ tabs }: { tabs: TabNavClientItem[] }) {
  const tabNavRef = useRef<HTMLUListElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtonState = () => {
    const node = tabNavRef.current;
    if (!node) {
      return;
    }

    const maxScrollLeft = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 0);
    setCanScrollRight(maxScrollLeft - node.scrollLeft > 1);
  };

  const scrollTabsBy = (distance: number) => {
    const node = tabNavRef.current;
    if (!node) {
      return;
    }

    node.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollButtonState();

    const handleResize = () => updateScrollButtonState();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [tabs.length]);

  return (
    <nav className={styles.tabNavWrap}>
      <button
        type="button"
        aria-label="왼쪽 탭 보기"
        className={styles.tabNavArrow.left}
        disabled={!canScrollLeft}
        onClick={() => scrollTabsBy(-220)}
      >
        <span className={styles.tabNavArrowIcon}>‹</span>
      </button>
      <div className={styles.tabNavViewport}>
        <ul
          ref={tabNavRef}
          className={styles.tabNav}
          onScroll={updateScrollButtonState}
        >
          {tabs.map((tab) => (
            <TabNavItem
              key={tab.tabURL}
              tabURL={tab.tabURL}
              tabTitle={tab.tabTitle}
              selected={tab.selected}
            />
          ))}
        </ul>
      </div>
      <button
        type="button"
        aria-label="오른쪽 탭 보기"
        className={styles.tabNavArrow.right}
        disabled={!canScrollRight}
        onClick={() => scrollTabsBy(220)}
      >
        <span className={styles.tabNavArrowIcon}>›</span>
      </button>
    </nav>
  );
}

export default TabNavClient;
