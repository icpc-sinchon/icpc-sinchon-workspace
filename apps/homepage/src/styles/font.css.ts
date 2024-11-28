import { globalFontFace } from "@vanilla-extract/css";

// KeepCalmMed 로컬 폰트 설정
globalFontFace("KeepCalmMed", {
  src: 'url("/fonts/KeepCalmMedium.woff2") format("woff2")',
});

export const fonts = {
  keepCalmMed: "KeepCalmMed",
} as const;
