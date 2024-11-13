import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const historyLayout = style({
  width: "92%",
  maxWidth: "1024px",
  height: "auto",
  border: `3px solid ${vars.colors.primarySurface}`,

  margin: "0 auto 6rem auto",
  padding: "3rem 4rem 4rem 4rem",

  display: "flex",
  flexDirection: "column",
  gap: "2rem",

  "@media": {
    "(max-width: 640px)": {
      margin: "0 auto 2rem auto",
      padding: "2rem",

      width: "100%",
      border: "none",
    },
  },
});

export const layoutHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const subTitle = style({
  fontWeight: 700,

  color: vars.colors.primarySurface,
  fontSize: "1.2rem",
  letterSpacing: "-0.08rem",
  lineHeight: 1.2,

  "@media": {
    "(max-width: 640px)": {
      fontSize: "1.1rem",
    },
  },
});
