import Text from "@components/Text";
import Title from "@components/Title";
import * as styles from "./styles.css";

type Props = {
  title: string;
  titleBadge?: string;
  text: string;
};

function TextSection({ title, titleBadge, text }: Props) {
  return (
    <section className={styles.container}>
      <Title badge={titleBadge}>{title}</Title>
      <Text>{text}</Text>
    </section>
  );
}

export default TextSection;
