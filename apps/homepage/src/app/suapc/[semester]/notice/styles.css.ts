import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

const itemBase = {
  lineHeight: "1.6",
};

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const list = style({
  marginLeft: "1rem",
});

export const bulletItem = style({
  ...itemBase,
  listStyleType: "disc",
  "::marker": {
    color: vars.colors.primarySurface,
  },
});

export const subBulletItem = style({
  ...itemBase,
  listStyleType: "circle",
  marginLeft: "1.5rem",
  "::marker": {
    color: vars.colors.primarySurface,
  },
});

export const plainItem = style({
  ...itemBase,
  listStyleType: "none",
});
