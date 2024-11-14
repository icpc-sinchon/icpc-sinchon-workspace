import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "1.2rem",

  "@media": {
    "screen and (max-width: 768px)": {
      alignItems: "flex-start",
      gap: "0.8rem",
    },
  },
});
