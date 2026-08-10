import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const frame = style({
  width: "100%",
  aspectRatio: "4 / 5",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",

  border: `1px solid ${vars.colors.primaryBorder}`,
  backgroundColor: vars.colors.primaryBackground,
});

// 포스터 비율이 4:5와 조금 달라도 잘리지 않도록 contain으로 맞춘다
export const poster = style({
  width: "100%",
  height: "100%",
  objectFit: "contain",
});

export const placeholder = style({
  padding: "1rem",
  fontSize: "0.9rem",
  color: vars.colors.primaryText,
  textAlign: "center",
});
