import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const table = style({
  width: "100%",

  textAlign: "center",
  fontSize: "0.8rem",

  borderCollapse: "collapse",

  overflowX: "auto",
  whiteSpace: "nowrap",

  overflowY: "hidden",
});

export const fixedLayout = style({
  tableLayout: "fixed",
});

export const tableRow = style({
  selectors: {
    "&:nth-child(even)": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
});

export const tableHeader = style({
  color: vars.colors.primarySurface,

  padding: "0.8rem 1rem",

  borderBottom: `1px solid ${vars.colors.primarySurface}`,
});

export const tableData = style({
  padding: "0.8rem 1rem",
});

export const link = style({
  color: vars.colors.black,
});
