import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const titleContainer = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const title = style({
  fontWeight: 700,

  color: vars.colors.primarySurface,
  fontSize: "1.2rem",
  letterSpacing: "-0.08rem",
  lineHeight: 1.2,

  "@media": {
    "(max-width: 768px)": {
      fontSize: "1.1rem",
    },
  },
});

export const badge = style({
  fontSize: "1.1rem",
  fontWeight: "700",
  backgroundColor: vars.colors.primarySurface, // 뱃지 배경색
  color: "white",
  padding: "0.2rem 0.4rem",
});
