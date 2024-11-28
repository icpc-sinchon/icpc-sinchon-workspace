import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

// TODO: 모바일 환경의 버튼 디자인 보강
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
      padding: "0.2rem",
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
