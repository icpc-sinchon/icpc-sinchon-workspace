import LinkButton from "@components/LinkButton";
import PosterFrame from "@components/PosterFrame";
import Text from "@components/Text";
import type { PromotionData } from "src/utils/getPromotionData";
import * as styles from "./styles.css";

function PromotionSection({
  contestTitle,
  contestPageURL,
  dateTime,
  posterURL,
  applyLink,
  applyPeriod,
}: PromotionData) {
  return (
    <section className={styles.container}>
      <div className={styles.posterContainer}>
        <PosterFrame imageURL={posterURL} alt={`${contestTitle} 포스터`} />
      </div>
      <div className={styles.infoContainer}>
        <p className={styles.label}>참가자 모집</p>
        <h2 className={styles.title}>{contestTitle}</h2>
        <Text>{dateTime}</Text>
        {applyPeriod && <Text>{`참가 신청 기간 ${applyPeriod}`}</Text>}
        <div className={styles.buttonContainer}>
          {applyLink && (
            <a
              href={applyLink}
              target="_blank"
              rel="noreferrer"
              className={styles.applyButton}
            >
              참가 신청하기
            </a>
          )}
          <LinkButton href={contestPageURL} disabled={false}>
            대회 안내 보기
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

export default PromotionSection;
