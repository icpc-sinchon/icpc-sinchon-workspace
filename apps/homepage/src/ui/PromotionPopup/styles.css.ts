import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";

// 전역 리셋이 margin을 0으로 만들기 때문에, 가운데 정렬을 위해 margin을 다시 지정한다
export const dialog = style({
  width: "min(24rem, 90vw)",
  maxHeight: "90vh",
  overflowY: "auto",

  margin: "auto",
  padding: 0,
  border: "none",

  backgroundColor: vars.colors.white,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
});

globalStyle(`${dialog}::backdrop`, {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
});

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",

  padding: "1.5rem 1.5rem 1rem",
});

export const label = style({
  fontSize: "0.9rem",
  fontWeight: 700,
  color: vars.colors.primarySurface,
});

export const title = style({
  fontWeight: 700,
  fontSize: "1.3rem",
  letterSpacing: "-0.04em",
  lineHeight: 1.2,

  marginBottom: "0.5rem",
});

export const description = style({
  fontSize: "0.9rem",
  lineHeight: 1.6,
  color: vars.colors.primaryText,
});

export const buttonContainer = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.75rem",

  marginTop: "0.5rem",
});

// PromotionSection의 버튼들과 같은 크기를 유지한다
const buttonBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${vars.colors.primarySurface}`,
  padding: "0.4rem 1.2rem",
  fontSize: "0.8rem",
  fontWeight: 700,
  textDecoration: "none",
});

export const applyButton = style([
  buttonBase,
  {
    color: vars.colors.white,
    backgroundColor: vars.colors.primarySurface,
  },
]);

export const detailLink = style([
  buttonBase,
  {
    color: vars.colors.primarySurface,
  },
]);

export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",

  padding: "0.75rem 1.5rem",

  borderTop: `1px solid ${vars.colors.primaryAccentBackground}`,
  backgroundColor: vars.colors.primaryBackground,
});

export const hideTodayLabel = style({
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",

  fontSize: "0.85rem",
  color: vars.colors.primaryText,
  cursor: "pointer",
});

export const closeButton = style({
  padding: "0.3rem 0.9rem",
  border: `1px solid ${vars.colors.primaryBorder}`,
  fontSize: "0.85rem",
  fontWeight: 700,
  color: vars.colors.primaryText,
  backgroundColor: vars.colors.white,
  cursor: "pointer",
});
