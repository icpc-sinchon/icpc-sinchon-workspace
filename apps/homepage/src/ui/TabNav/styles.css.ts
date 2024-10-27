import { fonts } from "@styles/font.css";
import { vars } from "@styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

export const tabNavWrap = style({
  padding: "1rem 2rem 2rem",
  display: "flex",
  msOverflowStyle: "none",
  "@media": {
    "(max-width: 500px)": {
      padding: "1rem",
    },
  },
});

export const tabNav = style({
  display: "flex",
  flexWrap: "wrap",
  rowGap: "1rem",
  columnGap: "2rem",
  margin: "0 auto",
});

const tabNavItemBase = style({
  height: "2rem",
  lineHeight: "2rem",
  borderRadius: "1rem",
  color: "white",
  fontFamily: fonts.keepCalmMed,
  fontWeight: 400,
  fontSize: "0.85rem",
  whiteSpace: "nowrap",
});

export const tabNavItem = styleVariants({
  selected: [
    tabNavItemBase,
    {
      backgroundColor: vars.colors.primarySurface,
    },
  ],
  unselected: [
    tabNavItemBase,
    {
      backgroundColor: vars.colors.primaryBorder,
    },
  ],
});

export const tabNavItemLink = style({
  textDecoration: "none",
  color: "inherit",
  padding: "0 1rem",
  display: "block",
  height: "100%",
});
