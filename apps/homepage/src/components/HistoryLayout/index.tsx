import * as styles from "./styles.css";

function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <article className={styles.historyLayout}>{children}</article>;
}

export default HistoryLayout;
