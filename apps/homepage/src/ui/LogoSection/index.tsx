import Title from "@components/Title";
import * as styles from "./styles.css";
import { Sponsor } from "src/types";
import Image from "next/image";

type Props = {
  title: string;
  titleBadge?: string;
  // 로고 이미지 경로들
  logoSources: string[];
};

function LogoSection({ title, titleBadge, logoSources }: Props) {
  return (
    <section className={styles.container}>
      <Title badge={titleBadge}>{title}</Title>
      <div className={styles.imageContainer}>
        {logoSources.map((source) => (
          <div key={source} className={styles.logoWrapper}>
            <Image
              width={300}
              height={100}
              key={source}
              className={styles.logo}
              src={source}
              alt={source}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default LogoSection;
