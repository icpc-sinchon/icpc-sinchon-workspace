import * as styles from "./styles.css";

function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <article className={styles.layout}>{children}</article>;
}

export default SponsorLayout;
