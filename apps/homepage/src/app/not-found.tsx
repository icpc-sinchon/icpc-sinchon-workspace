import Link from "next/link";
import * as styles from "./not-found.css";

export default function NotFound() {
  return (
    <div className={styles.notFoundWrapper}>
      <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
      <p className={styles.message}>
        요청하신 페이지가 존재하지 않거나 오류가 발생했습니다.
      </p>
      <Link href="/" className={styles.homeButton}>
        ICPC Sinchon 홈으로 돌아가기
      </Link>
    </div>
  );
}
