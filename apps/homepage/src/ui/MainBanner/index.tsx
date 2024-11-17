import HeroTitle from "@components/HeroTitle";
import * as styles from "./styles.css";
import Text from "@components/Text";
import Connection from "./subway";

function MainBanner() {
  return (
    <section className={styles.container}>
      <HeroTitle>ICPC Sinchon</HeroTitle>
      <div className={styles.textContainer}>
        <Text>신촌지역 5개 대학의 알고리즘 동아리들의 연합입니다.</Text>
        <Text>알고리즘 캠프, 대회 등 다양한 활동을 진행하고 있습니다.</Text>
      </div>
      <Connection />
    </section>
  );
}

export default MainBanner;
