import { Metadata } from "next";

export const metadata: Metadata = {
  title: "역대 캠프 콘테스트 | ICPC Sinchon",
  description: "ICPC Sinchon의 역대 캠프 콘테스트 정보입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "역대 캠프 콘테스트 | ICPC Sinchon",
    description: "ICPC Sinchon의 역대 캠프 콘테스트 정보입니다.",
    url: "https://icpc-sinchon.io/campcontest",
    images: ["/res/c-4.jpg"],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
