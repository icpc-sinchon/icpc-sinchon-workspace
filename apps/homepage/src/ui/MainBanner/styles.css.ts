import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",

  padding: "2rem 0",

  backgroundColor: vars.colors.primaryBackground,
});

export const textContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
