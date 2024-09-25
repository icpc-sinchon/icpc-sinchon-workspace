import styled from "styled-components";

function NoDataPlaceholder({ title }: { title: string }) {
  return (
    <Wrap>
      <Title>{title}</Title>
    </Wrap>
  );
}

const Wrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  width: 100%;
  color: ${(props) => props.theme.colors.primarySurface};
  font-size: 8rem;
  text-align: center;
`;

export default NoDataPlaceholder;
