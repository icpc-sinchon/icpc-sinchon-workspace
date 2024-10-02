import styled from "styled-components";
import { ReactNode } from "react";
import { Heading, Text } from "@radix-ui/themes";
import Sidebar from "./Sidebar";

function Layout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <LayoutWrap>
      <Sidebar />
      <ContentWrap>
        <Heading as="h1" size="8">
          {title}
        </Heading>
        {description && (
          <Text as="p" size="6" color="green">
            {description}
          </Text>
        )}
        {children}
      </ContentWrap>
      <Footer>
        <FlexBox>2022 © dongzoolee</FlexBox>
        <FlexBox>
          <a href="https://icpc-sinchon.io" target="_blank" rel="noreferrer">
            Official Site
          </a>
        </FlexBox>
      </Footer>
    </LayoutWrap>
  );
}

const LayoutWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  min-height: calc(100% - 57px);
  padding-left: ${(props) => props.theme.sidebarWidth};
`;

const ContentWrap = styled.main`
  padding: 1rem;
`;

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid rgba(152, 166, 173, 0.2);
  color: var(--footer-text-color);
  font-size: 12px;
  height: 57px;
  padding: 1.5rem;
  justify-content: space-between;
`;

const FlexBox = styled.div`
  display: flex;
`;

export default Layout;
