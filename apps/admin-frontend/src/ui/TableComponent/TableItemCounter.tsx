import styled from "styled-components";

function TableItemCounter({ count }: { count: number }) {
  return (
    <Wrap>
      <Text>개수: {count}</Text>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  width: max-content;
  margin-right: 0.8rem;
`;

const Text = styled.p`
  width: max-content;
  font-size: 14px;
  margin-right: 0.8rem;
  border-radius: 16px;
  &:last-child {
    margin-right: 0;
  }
`;
export default TableItemCounter;
