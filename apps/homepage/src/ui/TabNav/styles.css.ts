import { fonts } from "@styles/font.css";
import { vars } from "@styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

export const tabNavWrap = style({
  width: "92%",
  maxWidth: "1024px",
  margin: "0 auto",
  padding: "2rem 0",
  boxSizing: "border-box",
  display: "flex",
  overflow: "hidden",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
      maxWidth: "none",
      padding: "1rem",
    },
  },
});

export const tabNav = style({
  display: "flex",
  flexWrap: "nowrap",
  justifyContent: "flex-start",
  gap: "1rem",
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  scrollBehavior: "smooth",
  scrollSnapType: "x proximity",
  paddingBottom: "0.2rem",
  msOverflowStyle: "none",
  scrollbarWidth: "none",

  selectors: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
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
  flexShrink: 0,
  scrollSnapAlign: "start",
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
