import { vars } from "@styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

export const tabNav = style({
  display: "flex",
  gap: "1rem",
});

const tabNavItemBase = style({
  height: "2rem",
  lineHeight: "2rem",
  padding: "0 1rem",
  borderRadius: "1rem",
  color: "white",
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
});
