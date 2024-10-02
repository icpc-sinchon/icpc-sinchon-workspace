import axios from "axios";

export const adminAPI = axios.create({
  baseURL: "/api",
  withCredentials: true, // 쿠키를 포함하기 위해 필요
  headers: {
    "Content-Type": "application/json",
  },
  // baseURL: "https://admin.suapc.kr/api",
});

export const icpcSinchonAPI = axios.create({
  baseURL: "https://icpc-sinchon.io/s/api",
});
