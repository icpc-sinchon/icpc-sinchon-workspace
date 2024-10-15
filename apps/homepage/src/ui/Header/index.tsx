import Link from "next/link";
import Logo from "@components/Logo";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import { headerStyle, logoLinkStyle } from "./styles.css";

export type Category = {
  title: string;
  url: string;
};

// 각 라우트에서는 가장 최근의 카테고리 정보(예를 들어 지금 2024년 여름이면 2024 여름 SUAPC)를 가져와서 렌더링한다.
const categories: Category[] = [
  { title: "SUAPC", url: "/suapc" },
  { title: "Camp Contest", url: "/campcontest" },
  { title: "역대 캠프", url: "/camphistory" },
  { title: "명예의 전당", url: "/halloffame" },
  { title: "후원 및 협업", url: "/sponsor" },
];

function Header() {
  return (
    <header className={headerStyle}>
      <Link href="/" passHref className={logoLinkStyle}>
        <Logo />
      </Link>
      <Nav categories={categories} />
      <MobileNav categories={categories} />
    </header>
  );
}

export default Header;
