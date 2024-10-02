import styled from "styled-components";
import { MouseEvent } from "react";

function Tabs({
  tabs,
  selectedTab,
  handleTabClick,
}: {
  tabs: string[];
  selectedTab: string;
  handleTabClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <TabItem
          key={tab}
          onClick={handleTabClick}
          $selected={selectedTab === tab}
          value={tab}
        >
          {tab}
        </TabItem>
      ))}
    </TabsContainer>
  );
}

export default Tabs;

const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
`;

const TabItem = styled.button<{ $selected: boolean }>`
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.1rem 1rem;

  background-color: ${(props) =>
    props.$selected ? "rgba(0, 0, 0, 0.65)" : "transparent"};
  color: ${(props) => (props.$selected ? "white" : "black")};
  border-radius: 2rem;
  outline: none;
  border: none;
`;
