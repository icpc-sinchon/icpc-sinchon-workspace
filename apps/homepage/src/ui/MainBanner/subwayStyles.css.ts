// styles.css.ts
import { style } from "@vanilla-extract/css";

export const schoolNode = style({
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

export const clubName = style({
  textAlign: "center",
  width: "5rem",
});

export const subwayContainer = style({
  width: "90%",
  display: "flex",
  flexDirection: "column",
  margin: "2rem auto",
});

export const subwayLineContainer = style({
  padding: "0 1rem",
});

export const subwayLine = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "0.5rem",
});
