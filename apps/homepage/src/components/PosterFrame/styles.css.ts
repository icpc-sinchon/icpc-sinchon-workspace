import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const emptyFrame = style({
  width: "100%",
  aspectRatio: "4 / 5",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  border: `1px solid ${vars.colors.primaryBorder}`,
  backgroundColor: vars.colors.primaryBackground,
});

export const poster = style({
  width: "100%",
  height: "auto",

  border: `1px solid ${vars.colors.primaryBorder}`,
});

export const placeholder = style({
  padding: "1rem",
  fontSize: "0.9rem",
  color: vars.colors.primaryText,
  textAlign: "center",
});
