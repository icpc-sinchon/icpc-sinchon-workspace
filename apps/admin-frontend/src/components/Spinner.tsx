import styled, { keyframes } from "styled-components";

function Spinner() {
  return (
    <SpinnerWrap>
      <SpinnerBody />
    </SpinnerWrap>
  );
}

export default Spinner;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerBody = styled.div`
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border: 20px solid rgba(163, 151, 198, 0.2);
  border-top: 20px solid #14963d;
  border-radius: 50%;
  animation: ${spin} 2s linear infinite;
`;

const SpinnerWrap = styled.div`
  margin: 0 auto;
  padding: 2rem;
`;
