import { style } from "@vanilla-extract/css";
import { vars } from "src/styles/theme.css";

export const nav = style({
  height: "100%",
  display: "none",
  alignItems: "center",
  "@media": {
    "(min-width: 768px)": {
      display: "flex",
    },
  },
});

export const navLink = style({
  padding: "0 1rem",
  lineHeight: "4rem",
  textDecoration: "none",
  color: vars.colors.black,
  ":hover": {
    background: vars.colors.primaryBackground,
  },
});
