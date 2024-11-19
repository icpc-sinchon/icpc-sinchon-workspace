import { style } from "@vanilla-extract/css";

// TODO: 모바일 환경의 너비 조정
export const container = style({
  width: "90%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "0.5rem",

  padding: "2rem 0",
  margin: "0 auto",
});

export const title = style({
  fontWeight: 700,
  fontSize: "1.8rem",
  letterSpacing: "-0.04em",
  marginBottom: "0.6rem",
});

export const cardContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",

  "@media": {
    "screen and (min-width: 768px)": {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
});
