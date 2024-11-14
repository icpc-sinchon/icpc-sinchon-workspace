import HeroTitle from "@components/HeroTitle";
import * as styles from "./styles.css";

function HistoryLayout({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}) {
  return (
    <article className={styles.historyLayout}>
      <header className={styles.layoutHeader}>
        <HeroTitle>{title}</HeroTitle>
        <h2 className={styles.subTitle}>{subTitle}</h2>
      </header>
      {children}
    </article>
  );
}

export default HistoryLayout;
