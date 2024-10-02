import Document, { Html, Head, Main, NextScript } from "next/document";
// Import styled components ServerStyleSheet

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="theme-color" content="#009D3E" />
          <link rel="icon" href="/240white.svg" />
          <style />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
