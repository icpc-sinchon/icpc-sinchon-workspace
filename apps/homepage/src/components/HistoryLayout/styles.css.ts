import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const historyLayout = style({
  width: "92%",
  maxWidth: "1200px",
  height: "auto",
  border: `3px solid ${vars.colors.primarySurface}`,

  margin: "0 auto 6rem auto",
  padding: "3rem 4rem 4rem 4rem",

  "@media": {
    "(max-width: 640px)": {
      margin: "0 auto 2rem auto",
      padding: "2rem",

      width: "100%",
      border: "none",
    },
  },
});
