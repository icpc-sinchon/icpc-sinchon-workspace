import { style } from "@vanilla-extract/css";

// 카드 전체 컨테이너
export const cardContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "1rem",
  border: "1px solid #ddd",
  borderRadius: "0.5rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  transition: "transform 0.2s, box-shadow 0.2s",
  textAlign: "center",
  ":hover": {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
});

// 이미지 스타일
export const cardImage = style({
  width: "auto",
  height: "4rem",
  borderRadius: "0.5rem",
  objectFit: "cover",
  marginBottom: "1rem",
});

// 제목 스타일
export const cardTitle = style({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
  color: "#333",
});

// 내용 스타일
export const cardContent = style({
  fontSize: "1rem",
  lineHeight: "1.5",
  color: "#555",
});
