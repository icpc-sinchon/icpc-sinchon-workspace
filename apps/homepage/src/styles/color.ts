const palette = {
  white: "#FFFFFF",
  black: "#000000",

  gray: [
    "#f8f9fa",
    "#f1f3f5",
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#adb5bd",
    "#868e96",
    "#495057",
    "#343a40",
    "#212529",
  ],

  green: [
    "#fafefb",
    "#f4fbf5",
    "#e6f8e7",
    "#D6F2D8",
    "#C2EBC6",
    "#A9E1B0",
    "#87D292",
    "#4FBE67",
    "#009D3E",
    "#098E39",
  ],

  cyan: [
    "#E3FAFC",
    "#C5F6FA",
    "#99E9F2",
    "#66D9E8",
    "#3BC9DB",
    "#22B8CF",
    "#15AABF",
    "#1098AD",
    "#0C8599",
    "#0B7285",
  ],

  red: [
    "#FFF5F5",
    "#FFE3E3",
    "#FFC9C9",
    "#FFA8A8",
    "#FF8787",
    "#FF6B6B",
    "#FA5252",
    "#F03E3E",
    "#E03131",
    "#C92A2A",
  ],
};

export const COLORS = {
  white: palette.white,
  black: palette.black,
  boxBackground: palette.white,
  // 신촌의 상징색은 초록색이므로 초록색을 primary로 설정
  primarySurface: palette.green[8],
  primaryBackground: palette.gray[1],
  primaryAccentBackground: palette.gray[3],
  primaryBorder: palette.gray[5],
  primaryText: palette.gray[8],
  secondaryText: palette.white,
  secondaryBackground: palette.cyan[1],
  secondarySurface: palette.cyan[4],
  secondaryAccentSurface: palette.cyan[7],
  errorText: palette.red[6],
};
