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
  alignItems: "center",
  position: "relative",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
      maxWidth: "none",
      padding: "1rem 0",
    },
  },
});

export const tabNavViewport = style({
  width: "100%",
  overflow: "hidden",
  position: "relative",
  boxSizing: "border-box",
  padding: "0 3rem",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 2.4rem",
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
  padding: "0 0 0.2rem",
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
  color: vars.colors.primaryText,
  fontFamily: fonts.keepCalmMed,
  fontWeight: 400,
  fontSize: "0.85rem",
  whiteSpace: "nowrap",
  flexShrink: 0,
  scrollSnapAlign: "start",
  border: `1px solid ${vars.colors.primaryBorder}`,
  backgroundColor: vars.colors.white,
});

export const tabNavItem = styleVariants({
  selected: [
    tabNavItemBase,
    {
      borderColor: vars.colors.primarySurface,
      backgroundColor: vars.colors.primarySurface,
      color: vars.colors.white,
    },
  ],
  unselected: [
    tabNavItemBase,
    {
      borderColor: vars.colors.primaryBorder,
      backgroundColor: vars.colors.primaryBorder,
      color: vars.colors.white,
    },
  ],
});

export const tabNavItemLink = style({
  textDecoration: "none",
  color: "inherit",
  padding: "0 0.9rem",
  display: "block",
  height: "100%",
  textAlign: "center",
  overflow: "hidden",
});

const tabNavArrowBase = style({
  width: "1.9rem",
  height: "1.9rem",
  borderRadius: "999px",
  border: `1px solid ${vars.colors.primarySurface}`,
  backgroundColor: vars.colors.primarySurface,
  color: vars.colors.white,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 3,
  cursor: "pointer",
  transition: "opacity 0.15s ease, background-color 0.15s ease",
  selectors: {
    "&:not(:disabled):hover": {
      backgroundColor: "#098E39",
    },
    "&:disabled": {
      opacity: 0.3,
      cursor: "default",
    },
  },
});

export const tabNavArrow = styleVariants({
  left: [
    tabNavArrowBase,
    {
      left: "0.5rem",
    },
  ],
  right: [
    tabNavArrowBase,
    {
      right: "0.5rem",
    },
  ],
});

export const tabNavArrowIcon = style({
  fontSize: "1.15rem",
  lineHeight: 1,
});
