import * as styles from "./styles.css";

// TODO: 여기 "초급" 같은 텍스트가 담긴 뱃지를 넣을 수 있는 badge props 같은 거 추가
function Title({
  children,
  badge,
}: {
  children: React.ReactNode;
  badge?: string; // 뱃지에 표시할 텍스트 (예: "초급")
}) {
  return (
    <div className={styles.titleContainer}>
      {badge && <span className={styles.badge}>{badge}</span>}
      <h2 className={styles.title}>{children}</h2>
    </div>
  );
}

export default Title;
