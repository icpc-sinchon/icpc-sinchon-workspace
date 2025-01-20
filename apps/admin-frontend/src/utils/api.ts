import axios from "axios";

export const adminAPI = axios.create({
  baseURL: "/api",
  withCredentials: true, // 쿠키를 포함하기 위해 필요
  headers: {
    "Content-Type": "application/json",
  },
  // baseURL: "https://admin.suapc.kr/api",
});

// 401 에러 처리 인터셉터 추가
adminAPI.interceptors.response.use(
  (response) => response, // 응답 성공 시 그대로 반환
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error); // 다른 에러는 그대로 전달
  },
);

export const icpcSinchonAPI = axios.create({
  baseURL: "https://icpc-sinchon.io/s/api",
});
