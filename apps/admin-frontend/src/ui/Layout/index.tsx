import styled from "styled-components";
import { ReactNode } from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";
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
        <Flex>
          제작자:&nbsp;
          <a
            href="https://github.com/dongzoolee"
            target="_blank"
            rel="noreferrer"
          >
            이동주(GitHub Link)
          </a>
          ,&nbsp;
          <a
            href="https://github.com/witch-factory"
            target="_blank"
            rel="noreferrer"
          >
            김성현(GitHub Link)
          </a>
        </Flex>
        <Flex>
          <a href="https://icpc-sinchon.io" target="_blank" rel="noreferrer">
            신촌연합 공식 사이트 링크
          </a>
        </Flex>
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
  font-size: 1rem;
  height: 57px;
  padding: 1.5rem;
  justify-content: space-between;
`;

export default Layout;
