"use client";
import Header from "@ui/Header";
import StyledComponentsRegistry from "../lib/registry";
import "../styles/reset.css";
import { ThemeProvider } from "styled-components";
import { COLORS } from "src/styles/color";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider theme={{ colors: COLORS }}>
            <Header />
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
