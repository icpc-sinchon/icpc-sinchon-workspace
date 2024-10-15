import { globalStyle } from "@vanilla-extract/css";

globalStyle(":root", {
  fontFamily:
    "pretendard, apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  textRendering: "optimizeSpeed",
});

globalStyle("*", {
  margin: 0,
  padding: 0,
  boxSizing: "border-box",
});

globalStyle("html, body", {
  minHeight: "100vh",
  scrollBehavior: "smooth",
});

globalStyle("img", {
  display: "block",
});
