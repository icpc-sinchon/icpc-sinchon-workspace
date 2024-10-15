import { style } from "@vanilla-extract/css";
import { vars } from "src/styles/theme.css";

export const logoLinkStyle = style({
  lineHeight: "4rem",
  textDecoration: "none",
  padding: "0 0.5rem",
  color: "#000",
  ":hover": {
    background: "#f8f8f8",
  },
});

export const headerStyle = style({
  width: "100%",
  height: "4rem",
  display: "flex",
  position: "sticky",
  top: 0,
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #eaeaea",
  padding: "0 1rem",
  background: vars.colors.white,
});
