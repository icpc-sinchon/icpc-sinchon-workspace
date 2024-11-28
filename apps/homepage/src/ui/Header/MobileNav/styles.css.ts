import { style } from "@vanilla-extract/css";
import { vars } from "src/styles/theme.css";

export const nav = style({
  position: "fixed",
  top: "4rem",
  left: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  background: vars.colors.white,

  "@media": {
    "(min-width: 768px)": {
      display: "none",
    },
  },
});

export const navHidden = style({
  display: "none",
});

export const navLink = style({
  width: "100%",
  padding: "0 1rem",
  lineHeight: "3rem",
  textDecoration: "none",
  color: vars.colors.black,
  borderBottom: "1px solid #eaeaea",

  ":hover": {
    background: vars.colors.primaryBackground,
  },
});

export const menuToggleButton = style({
  height: "100%",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "1rem",

  ":hover": {
    background: vars.colors.primaryBackground,
  },

  "@media": {
    "(min-width: 768px)": {
      display: "none",
    },
  },
});
