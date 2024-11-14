import { style } from "@vanilla-extract/css";

export const tableContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "2.5rem",
  justifyContent: "space-between",

  "@media": {
    "(min-width: 768px)": {
      flexDirection: "row",
    },
  },
});
