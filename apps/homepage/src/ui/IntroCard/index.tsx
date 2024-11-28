import * as styles from "./styles.css";

type CardProps = {
  imageSrc: string;
  title: string;
  content: React.ReactNode;
};

function IntroCard({ imageSrc, title, content }: CardProps) {
  return (
    <section className={styles.cardContainer}>
      <img src={imageSrc} alt={title} className={styles.cardImage} />
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardContent}>{content}</p>
    </section>
  );
}

export default IntroCard;
