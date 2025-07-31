import Header from "@ui/Header";
import Footer from "@ui/Footer";
import PageLayout from "@ui/PageLayout";

import "@styles/reset.css";
import "@styles/theme.css";
import "@styles/font.css";
import { themeClass } from "@styles/theme.css";
import { Metadata } from "next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={themeClass}>
        <Header />
        <PageLayout>{children}</PageLayout>
        <Footer />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "메인 페이지 | ICPC Sinchon",
  description: "신촌지역 대학교 프로그래밍 연합입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "메인 페이지 | ICPC Sinchon",
    description: "신촌지역 대학교 프로그래밍 연합입니다.",
    url: "https://icpc-sinchon.io/",
    images: ["/res/og_image.png"],
  },
};
