"use client";
import styled from "styled-components";
import Image from "next/image";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.5rem;

  z-index: 1001;
`;

const LogoTitle = styled.h1`
  display: none;

  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.primarySurface};

  @media (min-width: 768px) {
    display: block;
  }
`;

function Logo() {
  return (
    <Wrapper>
      <Image src="/240svg.svg" alt="ICPC Sinchon" width={32} height={32} />
      <LogoTitle>ICPC Sinchon</LogoTitle>
    </Wrapper>
  );
}

export default Logo;
