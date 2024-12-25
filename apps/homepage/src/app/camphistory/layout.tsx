import { Metadata } from "next";

export const metadata: Metadata = {
  title: "역대 캠프 정보 | ICPC Sinchon",
  description: "ICPC Sinchon에서 진행한 역대 캠프의 정보 페이지입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "역대 캠프 정보 | ICPC Sinchon",
    description: "ICPC Sinchon에서 진행한 역대 캠프의 정보 페이지입니다.",
    url: "https://icpc-sinchon.io/camphistory",
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
