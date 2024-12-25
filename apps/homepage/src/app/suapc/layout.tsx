import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SUAPC | ICPC Sinchon",
  description: "ICPC Sinchon에 기여하신 분들을 기리는 명예의 전당입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "명예의 전당 | ICPC Sinchon",
    description: "ICPC Sinchon에 기여하신 분들을 기리는 명예의 전당입니다.",
    url: "https://icpc-sinchon.io/suapc",
    images: ["/res/og_image.png"],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
