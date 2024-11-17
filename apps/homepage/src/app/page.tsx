import MainContainer from "@components/MainContainer";
import Title from "@components/Title";
import IntroCard from "@ui/IntroCard";
import MainBanner from "@ui/MainBanner";

function HomePage() {
  return (
    <>
      <MainBanner />
      <MainContainer title="캠프 소개">
        <IntroCard
          imageSrc="/res/ferris-wheel.gif"
          title="알고리즘 행사"
          content={
            <>
              매 시즌마다 알고리즘 행사를 개최합니다.
              <br />
              참가자들의 성장을 돕는 알고리즘 캠프,
              <br />
              팀을 이루어 경쟁하는 SUAPC까지.
            </>
          }
        />
        <IntroCard
          imageSrc="/res/direct-hit.gif"
          title="대회 준비"
          content={
            <>
              국제 대학생 프로그래밍 대회 ICPC를 위해
              <br />
              신촌 최고의 대회 SUAPC로 함께 대비합니다.
            </>
          }
        />
        <IntroCard
          imageSrc="res/community.gif"
          title="커뮤니티"
          content={
            <>
              알고리즘 캠프는 다양한 사람들이 모여
              <br />
              서로의 지식을 공유하고 소통하는 공간입니다.
            </>
          }
        />
      </MainContainer>
      <MainContainer title="캠프 참가 안내">
        <IntroCard
          imageSrc="/res/raising-hands.svg"
          title="캠프 참가 안내"
          content={
            <>
              함께 성장하고 싶은 학회원들을 모집하고 있습니다.
              <br />매 시즌마다 진행되는 ICPC Sinchon 활동에 참여하기를 원한다면
              각 학교 학회의 학회장에게 문의해주세요.
            </>
          }
        />
      </MainContainer>
    </>
  );
}

export default HomePage;
