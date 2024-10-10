import Link from "next/link";
import styled from "styled-components";

export type Category = {
  title: string;
  url: string;
};

const Nav = styled.nav`
  height: 100%;
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  padding: 0 0.5rem;
  line-height: 4rem;
  text-decoration: none;
  color: ${(props) => props.theme.colors.black};
`;

function Navigation({ categories }: { categories: Category[] }) {
  return (
    <Nav>
      {categories.map((category) => (
        <NavLink key={category.url} href={category.url} passHref>
          {category.title}
        </NavLink>
      ))}
    </Nav>
  );
}

export default Navigation;
