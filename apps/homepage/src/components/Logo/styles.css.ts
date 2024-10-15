import { style } from "@vanilla-extract/css";
import { vars } from "src/styles/theme.css";

export const wrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  gap: "0.5rem",
  zIndex: 1001,
});

export const logoTitle = style({
  fontSize: "1.5rem",
  color: vars.colors.primarySurface,
});
