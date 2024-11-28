import * as styles from "./styles.css";
import Image from "next/image";

function Logo() {
  return (
    <div className={styles.wrapper}>
      <Image src="/240svg.svg" alt="ICPC Sinchon" width={32} height={32} />
      <h1 className={styles.logoTitle}>ICPC Sinchon</h1>
    </div>
  );
}

export default Logo;
