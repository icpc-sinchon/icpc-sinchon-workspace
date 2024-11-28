import * as styles from "./styles.css";

function Text({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className={styles.contentText}>{children}</p>;
}

export default Text;
