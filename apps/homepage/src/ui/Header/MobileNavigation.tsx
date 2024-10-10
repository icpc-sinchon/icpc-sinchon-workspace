"use client";
import type { Category } from "./Navigation";
import Link from "next/link";
import styled from "styled-components";
import { useState } from "react";
import { CloseIcon, HamburgerIcon } from "./icons";

const Nav = styled.nav<{ $isOpen: boolean }>`
  position: fixed;
  top: 4rem;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  background: ${(props) => props.theme.colors.white};

  @media (min-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  width: 100%;
  padding: 0 1rem;
  line-height: 3rem;
  text-decoration: none;
  color: ${(props) => props.theme.colors.black};
  border-bottom: 1px solid #eaeaea;

  &:hover {
    background: ${(props) => props.theme.colors.primaryBackground};
  }
`;

const MenuToggleButton = styled.button`
  height: 100%;
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;

  &:hover {
    background: ${(props) => props.theme.colors.primaryBackground};
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

function MobileNavigation({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <MenuToggleButton onClick={toggleMenu}>
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </MenuToggleButton>
      <Nav $isOpen={isOpen}>
        {categories.map((category) => (
          <NavLink key={category.url} href={category.url} passHref>
            {category.title}
          </NavLink>
        ))}
      </Nav>
    </>
  );
}

export default MobileNavigation;
