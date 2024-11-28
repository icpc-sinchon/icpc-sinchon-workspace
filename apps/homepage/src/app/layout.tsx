import Header from "@ui/Header";
import Footer from "@ui/Footer";
import PageLayout from "@ui/PageLayout";

import "@styles/reset.css";
import "@styles/theme.css";
import "@styles/font.css";
import { themeClass } from "@styles/theme.css";

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
