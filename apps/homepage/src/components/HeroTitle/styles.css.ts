import { fonts } from "@styles/font.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const title = style({
  fontFamily: fonts.keepCalmMed,
  fontWeight: 400,

  color: vars.colors.primarySurface,
  fontSize: "2.6rem",
  letterSpacing: "-0.08rem",
  lineHeight: 1.2,

  margin: 0,

  "@media": {
    "(max-width: 640px)": {
      fontSize: "2rem",
    },
  },
});
