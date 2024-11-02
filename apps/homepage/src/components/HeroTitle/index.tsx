import * as styles from "./styles.css";

function HeroTitle({ children }) {
  return <h1 className={styles.title}>{children}</h1>;
}

export default HeroTitle;
