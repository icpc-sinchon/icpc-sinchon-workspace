import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const logoWrapper = style({
  width: "12rem",
  height: "2rem",
});

export const logo = style({
  width: "auto",
  height: "2rem",
  objectFit: "contain",
});

export const list = style({
  marginLeft: "1rem",
});

export const item = style({
  lineHeight: "1.6",
  "::marker": {
    color: vars.colors.primarySurface,
  },
});
