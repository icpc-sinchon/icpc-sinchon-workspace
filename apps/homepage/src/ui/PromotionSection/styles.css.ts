import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  width: "90%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",

  padding: "2rem 0",
  margin: "0 auto",

  "@media": {
    "screen and (min-width: 768px)": {
      flexDirection: "row",
      justifyContent: "center",
      gap: "2.5rem",
    },
  },
});

export const posterContainer = style({
  width: "100%",
  maxWidth: "20rem",
  flexShrink: 0,
});

export const infoContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const label = style({
  fontSize: "0.9rem",
  fontWeight: 700,
  color: vars.colors.primarySurface,
});

export const title = style({
  fontWeight: 700,
  fontSize: "1.8rem",
  letterSpacing: "-0.04em",
  lineHeight: 1.2,
});

export const buttonContainer = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.75rem",

  marginTop: "0.5rem",
});

// LinkButton과 크기를 맞추고, 배경을 채워 주된 행동임을 드러낸다
export const applyButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${vars.colors.primarySurface}`,
  padding: "0.4rem 1.2rem",
  fontSize: "0.8rem",
  fontWeight: 700,
  color: vars.colors.white,
  backgroundColor: vars.colors.primarySurface,
  textDecoration: "none",
});
