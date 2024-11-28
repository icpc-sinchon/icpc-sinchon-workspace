import * as styles from "./styles.css";

function MainContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardContainer}>{children}</div>
    </section>
  );
}

export default MainContainer;
