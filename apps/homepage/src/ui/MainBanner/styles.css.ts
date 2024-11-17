import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",

  padding: "2rem 0",

  backgroundColor: vars.colors.primaryBackground,
});

export const textContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const subwayContainer = style({
  width: "90%",
  display: "flex",
  flexDirection: "column",
  margin: "2rem auto",
});

export const schoolContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const logoContainer = style({
  display: "flex",
  height: "4rem",
  margin: "0 auto",
});

export const logo = style({
  height: "100%",
  width: "auto",
});

export const clubName = style({
  textAlign: "center",
  width: "5rem",
});

export const stationContainer = style({
  width: "5.5rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.3rem",
  flexDirection: "row",
  fontSize: "0.9rem",
});

export const station = style({
  width: "1.6rem",
  height: "1.6rem",
  color: "white",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "0.6rem",
});

export const subwayLineContainer = style({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  padding: "0 1.5rem",
});

export const nodeContainer = style({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "0.5rem",
});
