import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const imageContainer = style({
  display: "flex",
  flexDirection: "row",
  overflow: "auto",
  gap: "1.5rem",
  justifyContent: "flex-start",
  flexWrap: "wrap",
  marginTop: "1rem",
});

export const logoWrapper = style({
  height: "2rem",
});

export const logo = style({
  width: "auto",
  height: "2rem",
  objectFit: "contain",
});
