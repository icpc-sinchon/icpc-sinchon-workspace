"use client";

import styled, { css } from "styled-components";
import Link from "next/link";
import Logo from "./Logo";
import type { Category } from "./Navigation";
import Navigation from "./Navigation";
import { forwardRef } from "react";
import MobileNavigation from "./MobileNavigation";

// 각 라우트에서는 가장 최근의 카테고리 정보(예를 들어 지금 2024년 여름이면 2024 여름 SUAPC)를 가져와서 렌더링한다.
const categories: Category[] = [
  { title: "SUAPC", url: "/suapc" },
  { title: "Camp Contest", url: "/campcontest" },
  { title: "역대 캠프", url: "/camphistory" },
  { title: "명예의 전당", url: "/halloffame" },
  { title: "후원 및 협업", url: "/sponsor" },
];

const LogoLink = styled(Link)`
  line-height: 4rem;
  text-decoration: none;
  padding: 0 0.5rem;
  color: ${(props) => props.theme.colors.black};

  &:hover {
    background: ${(props) => props.theme.colors.primaryBackground};
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <LogoLink href="/" passHref>
        <Logo />
      </LogoLink>
      <Navigation categories={categories} />
      <MobileNavigation categories={categories} />
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  height: 4rem;
  display: flex;
  position: sticky;
  top: 0;
  align-items: center;  
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
  padding: 0 1rem;
  background: ${(props) => props.theme.colors.white};
`;
