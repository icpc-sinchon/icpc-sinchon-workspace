import Text from "@components/Text";
import * as styles from "./styles.css";

import TabNav from "@ui/TabNav";
import Image from "next/image";
import ListSection from "@ui/ListSection";
import Title from "@components/Title";
import { renderLink } from "src/utils/renderHelpers";
import React from "react";

const sponsorRouters = [
  {
    title: "기업 후원",
    url: "/sponsor",
  },
  {
    title: "개인 후원",
    url: "/sponsor/personal",
  },
];

// TODO: tab nav와 밑 요소들 간의 간격 줄이기
function CorporateSponsorPage() {
  return (
    <>
      <TabNav
        tabList={sponsorRouters}
        currentTabIndex={0}
        makeTabURL={(sponsor) => sponsor.url}
        makeTabTitle={(sponsor) => sponsor.title}
      />
      <h2 className={styles.pageTitle}>
        <span className={styles.sinchon}>ICPC Sinchon</span>과 함께할 후원사를
        모집하고 있습니다.
      </h2>
      <Text>
        지금까지의 모든 연합 활동은 후원사의 후원을 통해 성공적으로 개최될 수
        있었습니다.
        <br />
        참가자에게 제공되는 상금 및 각종 상품들을 제공해주시면,{" "}
        <span className={styles.sinchon}>ICPC Sinchon</span>은 참가자들을 상대로
        기업에 대한 홍보를 진행합니다.
        <br />매 시즌 신촌지역 5개 대학의 컴퓨터공학 전공생들을 대상으로
        이루어지는 연합 활동의 후원사로 참여하여 기업 홍보 효과를 누리세요.
        <br />
      </Text>
      <div className={styles.bannerWrapper}>
        <Image
          width={1000}
          height={400}
          src="/res/stickers-3.jpg"
          alt="dev-community-stickers"
          className={styles.banner}
        />
      </div>
      <ListSection
        title="다음의 후원품들을 제공받고 있습니다."
        items={[
          "후원금",
          "컴퓨터 과학 서적",
          "기업 로고 스티커 및 기념품",
          "기업 이름을 상 이름으로 한 특별상 상품",
        ]}
      />
      <ListSection
        title="다음과 같은 기업 홍보 방안을 제공합니다."
        items={[
          "대회 포스터 내 후원사 로고 포함",
          "후원사 이름 및 서비스와 관련된 대회 문제 출제",
          "대회 이후 진행되는 스트리밍에서 후원사 홍보 세션 제공",
          "후원사 기술 커뮤니티 내 대회 결과 보고 관련 게시글 작성",
          "1등상 혹은 특별상의 이름을 후원사의 이름이 반영되도록 지정",
          "대회 이후 진행되는 스트리밍 화면 하단을 후원사 로고가 보여지도록 구성",
          "대회 수상자의 개인정보(이름, 나이, 소속 학교) 제공",
        ]}
      />
      <section className={styles.sponsorSection}>
        <Title>다음과 같은 기업 맞춤 홍보를 진행하고 있습니다.</Title>
        <div className={styles.sponsorList}>
          <ListSection
            logoSource={{
              name: "카카오",
              src: "/res/sponsor-ci/kakao.png",
            }}
            items={[
              <React.Fragment key="홍보세션">
                카카오 추천팀{" "}
                {renderLink({
                  title: "홍보 세션(링크)",
                  url: "https://youtu.be/JS8UKTQ2iW0",
                })}
                제공
              </React.Fragment>,
              <React.Fragment key="문제출제">
                카카오 관련 대회 문제 출제
                <br />
                {renderLink({
                  title:
                    "20942번 신촌지역 초중고등학생 프로그래밍 대회 동아리 연합 대회",
                  url: "https://www.acmicpc.net/problem/20942",
                })}
                <br />
                {renderLink({
                  title: "20943번 카카오톡",
                  url: "https://www.acmicpc.net/problem/20943",
                })}
              </React.Fragment>,
              "Beyond Kakao를 1등상 명칭으로 사용",
              "Connect Kakao를 1등상 명칭으로 사용",
            ]}
          />
          <ListSection
            logoSource={{
              name: "현대오토에버 로고",
              src: "/res/sponsor-ci/autoever.png",
            }}
            items={[
              <React.Fragment key="문제출제">
                현대오토에버 관련 문제 출제
                <br />
                {renderLink({
                  title: "22991번 수요응답형 버스",
                  url: "https://www.acmicpc.net/problem/22991",
                })}
              </React.Fragment>,
              "현대오토에버 기업 홍보 세션 제공",
            ]}
          />
          <ListSection
            logoSource={{
              name: "NAVER D2 로고",
              src: "/res/sponsor-ci/naver-d2.png",
            }}
            items={[
              <React.Fragment key="문제출제">
                네이버 관련 대회 문제 출제
                <br />
                {renderLink({
                  title: "20937번 떡국",
                  url: "https://www.acmicpc.net/problem/20937",
                })}
                <br />
                {renderLink({
                  title: "20948번 Go와 함께하는 전화망 서비스",
                  url: "https://www.acmicpc.net/problem/20943",
                })}
              </React.Fragment>,
            ]}
          />
          <ListSection
            logoSource={{
              name: "PUBG 로고",
              src: "/res/sponsor-ci/pubg.png",
            }}
            items={["펍지 / 크래프톤 기업 홍보 세션 제공"]}
          />
          <ListSection
            logoSource={{
              name: "헬로알고 로고",
              src: "/res/sponsor-ci/hello-algo.png",
            }}
            items={[
              "퓨처테크아카데미 관련 문제 출제",
              "퓨처테크아카데미 기업 홍보 세션 제공",
              "퓨처테크아카데미 HelloAlgo 를 3등상 명칭으로 사용",
              "연합 학회별 5개 커뮤니티에 멘토 및 연구원 모집 홍보",
            ]}
          />
          <ListSection
            logoSource={{
              name: "퓨리오사 AI 로고",
              src: "/res/sponsor-ci/furiosa.png",
            }}
            items={["퓨리오사 AI 기업 홍보 세션 제공"]}
          />
          <ListSection
            logoSource={{
              name: "VUNO 로고",
              src: "/res/sponsor-ci/vuno.png",
            }}
            items={["뷰노 기업 홍보 세션 제공"]}
          />
        </div>
        <section className={styles.container}>
          <Title>
            언제든지 <span className={styles.sinchon}>ICPC Sinchon</span>과
            함께하세요.
          </Title>
          <Text>
            후원에 함께해주시는 만큼 저희도 후원사 홍보에 최선을 다할 것을
            약속드립니다.
            <br />
            관련 문의는{" "}
            <a
              href="mailto:icpc.sinchon@gmail.com"
              style={{
                color: "black",
              }}
            >
              icpc.sinchon@gmail.com
            </a>
            으로 연락주시면 감사드리겠습니다.
          </Text>
        </section>
      </section>
    </>
  );
}

export default CorporateSponsorPage;
