import { Metadata } from "next";
import * as styles from "./styles.css";

function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <article className={styles.layout}>{children}</article>;
}

export default SponsorLayout;

export const metadata: Metadata = {
  title: "후원 페이지 | ICPC Sinchon",
  description:
    "ICPC Sinchon에서 진행하는 활동의 후원사 정보와 후원을 위한 안내입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "후원 페이지 | ICPC Sinchon",
    description:
      "ICPC Sinchon에서 진행하는 활동의 후원사 정보와 후원을 위한 안내입니다.",
    url: "https://icpc-sinchon.io/sponsor",
    images: ["/res/og_image.png"],
  },
};
