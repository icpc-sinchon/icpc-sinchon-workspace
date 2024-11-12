import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const customButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${vars.colors.primarySurface}`,
  padding: "0.4rem 1.2rem",
  fontSize: "0.8rem",
  fontWeight: 700,
  color: vars.colors.primarySurface,
  textDecoration: "none",

  "@media": {
    "(max-width: 768px)": {
      border: "none",
      padding: "0.2rem 0",
    },
  },
});

export const disabledButton = style({
  cursor: "not-allowed",
  backgroundColor: "#eeeeee",
  color: "#aaaaaa",
  border: "none",
  pointerEvents: "none",

  "@media": {
    "(max-width: 768px)": {
      backgroundColor: "transparent",
    },
  },
});
