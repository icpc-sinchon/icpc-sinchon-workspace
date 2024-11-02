import { style } from "@vanilla-extract/css";

export const contentText = style({
  fontWeight: 500,

  fontSize: "1rem",
  lineHeight: 1.6,

  margin: 0,

  "@media": {
    "(max-width: 640px)": {
      fontSize: "0.9rem",
      lineHeight: 1.6,
    },
  },
});
