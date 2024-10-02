import React, { memo } from "react";
import Link from "next/link";
import styled from "styled-components";

import { Flex, Heading } from "@radix-ui/themes";
import FlexGrow from "@/components/FlexGrow";

import { useAuth } from "@/contexts/AuthContext";

type SidebarItemType = {
  title: string;
  icon: string;
  url: string;
};

const sidebarItems: SidebarItemType[] = [
  {
    title: "학생 관리",
    icon: "/res/student-management.svg",
    url: "/student",
  },
  {
    title: "출석 관리",
    icon: "/res/attend-check.svg",
    url: "/attend",
  },
  {
    title: "링크 관리",
    icon: "/res/link.svg",
    url: "/shorturl",
  },
  {
    title: "설정 관리",
    icon: "/res/setting-white.svg",
    url: "/setting",
  },
];

function Sidebar() {
  const { logout } = useAuth();
  return (
    <SidebarWrap>
      <LogoIconWrap>
        <Link href="/" style={{ textDecoration: "none" }}>
          <LogoIcon src="/240white.svg" />
        </Link>
      </LogoIconWrap>
      <SidebarList>
        {sidebarItems.map((item) => (
          <Li key={item.title}>
            <Link href={item.url} passHref>
              <SidebarItem title={item.title} icon={item.icon} />
            </Link>
          </Li>
        ))}
      </SidebarList>
      <FlexGrow />
      <NavButton onClick={logout}>
        <SidebarItem title="로그아웃" icon="/res/logout.svg" />
      </NavButton>
    </SidebarWrap>
  );
}

function SidebarItem({ title, icon }: { title: string; icon: string }) {
  return (
    <Flex width="100%" direction="row" align="center" justify="center" gap="5">
      <NavIcon src={icon} alt={title} />
      <SidebarItemTitle>{title}</SidebarItemTitle>
    </Flex>
  );
}

export default memo(Sidebar);

const SidebarItemTitle = styled(Heading).attrs({
  as: "h3",
  size: "3",
  weight: "regular",
})`
  display: none;
  transition: opacity 200ms ease-in-out;
  white-space: nowrap;
  color: white;
`;

const SidebarWrap = styled.aside`
  width: ${(props) => props.theme.sidebarWidth};
  height: 100%;

  position: fixed;
  left: 0;

  display: flex;
  flex-direction: column;

  padding: 2rem 0;
  align-items: center;
  justify-content: center;

  transition: width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  background: ${(props) => props.theme.colors.primarySurface};
  z-index: 10001;
  color: white;

  &:hover {
    width: ${(props) => props.theme.sidebarHoverWidth};

    ${SidebarItemTitle} {
      display: block;
    }
  }
`;

const LogoIconWrap = styled.div`
  width: 33px;
  height: 33px;
  margin-bottom: 1rem;
`;

const LogoIcon = styled.img`
  width: 100%;
`;

const SidebarList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Li = styled.li`
  width: 100%;
  padding: 12px 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: start;
`;

const NavIcon = styled.img`
  width: 30px;
  cursor: pointer;
`;

const NavButton = styled.button`
  width: 100%;
  padding: 12px 8px;
  background: none;
  border: none;
`;
