import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const notFoundWrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
  backgroundColor: "#f8f9fa",
  color: "#212529",
});

export const title = style({
  fontSize: "2rem",
  fontWeight: 700,
  marginBottom: "1rem",
});

export const message = style({
  fontSize: "1.2rem",
  marginBottom: "1.5rem",
});

export const homeButton = style({
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  fontWeight: 500,
  backgroundColor: vars.colors.primarySurface,
  color: vars.colors.white,
  border: "none",
  borderRadius: "0.25rem",
  cursor: "pointer",
  textDecoration: "none",
});
