import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";

export const footerWrapper = style({
  padding: "2rem 1rem",
  background: vars.colors.primaryAccentBackground,
});

export const container = style({
  width: "90%",
  margin: "0 auto",
  display: "flex",
  position: "relative",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

export const orgTitle = style({
  fontSize: "1rem",
  margin: "0.5rem 0",
  fontWeight: "bold",
  color: vars.colors.primaryText,
});

export const orgDescription = style({
  fontSize: "1rem",
  color: vars.colors.primaryText,
});

export const snsIcons = style({
  gap: "1.2rem",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  right: 0,

  "@media": {
    "screen and (max-width: 768px)": {
      position: "relative",
      gap: "1rem",
      marginTop: "1rem",
    },
  },
});
