import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";
import { fonts } from "@styles/font.css";

export const layout = style({
  width: "92%",
  maxWidth: "1024px",
  height: "auto",

  margin: "0 auto 6rem auto",
  padding: "0 5rem",

  display: "flex",
  flexDirection: "column",
  gap: "2rem",

  "@media": {
    "(max-width: 768px)": {
      margin: "0 auto 2rem auto",
      padding: "2rem",

      width: "100%",
    },
  },
});

export const pageTitle = style({
  color: vars.colors.primarySurface,
  fontSize: "2rem",
  fontWeight: "bold",
});

export const sinchon = style({
  color: vars.colors.primarySurface,
  fontFamily: fonts.keepCalmMed,
});

export const bannerWrapper = style({
  height: "400px",
  overflow: "hidden",
  marginBottom: "3rem",

  "@media": {
    "(max-width: 1000px)": {
      height: "50vw",
    },
  },
});

export const banner = style({
  objectFit: "contain",
  width: "auto",
  "@media": {
    "(max-width: 1000px)": {
      height: "50vw",
    },
  },
});

export const sponsorSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const sponsorList = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "2rem",

  "@media": {
    "(max-width: 1200px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "(max-width: 768px)": {
      gridTemplateColumns: "repeat(1, 1fr)",
    },
  },
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});
