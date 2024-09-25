import styled from "styled-components";

export const TableWrap = styled.div`
  margin: 0 auto;

  width: 100%;
  height: calc(100% - 90px);
`;

export const TableTitle = styled.div<{ $size?: "big" }>`
  font-size: ${(props) => (props.$size === "big" ? "1.4rem" : "0.9rem")};
  font-weight: 700;
  padding: 0.4rem 0.2rem;
`;

export const TableCaption = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TableNavigation = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
`;

export const TableNavigationItem = styled.div`
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.1rem 1rem;
`;
