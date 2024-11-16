import Title from "@components/Title";
import * as styles from "./styles.css";
import Image from "next/image";
import type React from "react";

type Props = {
  title?: string;
  logoSource?: {
    name: string;
    src: string;
  };
  items: (string | React.ReactNode)[];
};

function ListSection({ title, logoSource, items }: Props) {
  return (
    <section className={styles.container}>
      {title && <Title>{title}</Title>}
      {logoSource && (
        <div className={styles.logoWrapper}>
          <img
            src={logoSource.src}
            alt={logoSource.name}
            className={styles.logo}
          />
        </div>
      )}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={JSON.stringify(item)} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ListSection;
