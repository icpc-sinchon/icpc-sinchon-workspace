"use client";
import Link from "next/link";
import type { Category } from "..";
import * as styles from "./styles.css";
import { CloseIcon, HamburgerIcon } from "@components/icons";
import { useState } from "react";

// TODO: 페이지 전환, 너비 전환 시 메뉴가 접히도록 하기
function MobileNav({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        type="button"
        className={styles.menuToggleButton}
        onClick={toggleMenu}
      >
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>
      <nav className={isOpen ? styles.nav : styles.navHidden}>
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
    </>
  );
}

export default MobileNav;
