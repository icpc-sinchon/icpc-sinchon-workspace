"use client";
// TODO: current semester 설정해서 가져오게 수정

import Logo from "@ui/Header/Logo";
import styled from "styled-components";
import { mockData } from "./mock";

type Manager = {
  name: string;
  school: string;
  role: string;
};

const makeNameList = (list: Manager[]) => list.map((m) => m.name).join(" | ");

// DB에 저장된 정보를 쓰거나 아니면 current semester json 파일을 사용
function Footer() {
  return (
    <FooterWrapper>
      <Container>
        <Logo />
        <OrgTitle>신촌지역 대학교 프로그래밍 동아리 연합</OrgTitle>
        <br />
        <OrgTitle>회장</OrgTitle>
        <OrgDescription>{makeNameList(mockData.president)}</OrgDescription>
        <OrgTitle>운영진</OrgTitle>
        <OrgDescription>{makeNameList(mockData.manager)}</OrgDescription>
        <br />
        <OrgDescription>
          04107 서울시 마포구 백범로 35 (신수동) 서강대학교 김대건관(K관) 512호
          | icpc.sinchon@gmail.com
        </OrgDescription>
        <OrgDescription>© ICPC Sinchon. All Rights Reserved.</OrgDescription>
      </Container>
    </FooterWrapper>
  );
}

export default Footer;

const FooterWrapper = styled.footer`
  padding: 2rem 1rem;
  background: ${(props) => props.theme.colors.primaryAccentBackground};
`;

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const OrgTitle = styled.h2`
  font-size: 1rem;
  margin: 0.5rem 0;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primaryText};
`;

const OrgDescription = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.primaryText};
`;
