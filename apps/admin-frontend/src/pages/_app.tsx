import type { AppProps } from "next/app";

import "@radix-ui/themes/styles.css";
// import "@/styles/index.css";
import "@/styles/radix.css";
import Head from "next/head";
import { Theme } from "@radix-ui/themes";

import { ThemeProvider } from "styled-components";
import { COLORS } from "@/styles/colors";
import GlobalStyle from "@/styles/global";
import { constants } from "@/styles/constants";
import { SemesterProvider } from "@/contexts/SemesterContext";
import { AuthProvider } from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ICPC Sinchon Admin</title>
      </Head>
      {/* do not apply the themes background color */}
      <ThemeProvider theme={{ colors: COLORS, ...constants }}>
        <GlobalStyle />
        <Theme accentColor="green" hasBackground={false}>
          <SemesterProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </SemesterProvider>
        </Theme>
      </ThemeProvider>
    </>
  );
}
