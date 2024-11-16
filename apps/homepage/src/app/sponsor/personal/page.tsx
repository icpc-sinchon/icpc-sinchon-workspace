import Text from "@components/Text";
import * as styles from "../styles.css";

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
// TODO: 배너 사진 너비를 적절하게 조절해서 사진 다 나오게 하기
function PersonalSponsorPage() {
  return (
    <>
      <TabNav
        tabList={sponsorRouters}
        currentTabIndex={1}
        makeTabURL={(sponsor) => sponsor.url}
        makeTabTitle={(sponsor) => sponsor.title}
      />
      <h2 className={styles.pageTitle}>
        <span className={styles.sinchon}>ICPC Sinchon</span>을 도와주실 개인
        후원자님을 환영합니다.
      </h2>
      <Text>
        지금까지의 모든 연합 활동에 후원자님의 후원이 큰 도움이 되었습니다.
        <br />
        캠프 운영을 후원해 주시면 후원 금액에 따라{" "}
        <span className={styles.sinchon}>ICPC Sinchon</span>에서 혜택을
        제공해드립니다.
        <br />
      </Text>
      <div className={styles.bannerWrapper}>
        <Image
          width={1000}
          height={400}
          src="/res/personalSponsor.png"
          alt="개인 후원 페이지 배너"
          className={styles.banner}
        />
      </div>
      <ListSection
        title="다음과 같은 혜택을 제공합니다."
        items={[
          "신촌 연합 공식 홈페이지 SUAPC 섹션 개인 후원 명단에 기록",
          "10만원 이상 후원 시: SUAPC 2024 Winter 대회 스트리밍 세션에서 후원자 명단에 언급",
          "20만원 이상 후원 시: 문제에 백준 핸들 또는 이름 언급",
          "30만원 이상 후원 시: 대회 특별상에 언급",
        ]}
      />
      <ListSection
        title="다음의 계좌로 후원금을 받고 있습니다."
        items={["79798752726 카카오뱅크 (예금주 : 김예송)"]}
      />
      <section className={styles.container}>
        <Title>후원 후 다음의 폼을 작성해 주세요.</Title>
        <Text>
          원활한 특전 제공을 위해 아래의 폼을 작성하여 제출해주시길 바랍니다.
          <br />
          {renderLink({
            title: "https://forms.gle/zTBdraCHA2J4PpVx5",
            url: "https://forms.gle/zTBdraCHA2J4PpVx5",
          })}
        </Text>
      </section>
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
    </>
  );
}

export default PersonalSponsorPage;
