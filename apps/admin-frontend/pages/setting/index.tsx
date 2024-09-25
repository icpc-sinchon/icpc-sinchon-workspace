import { useEffect } from "react";
import { useRouter } from "next/router";

// TODO: 학기 편집 페이지로 바꾸고 학기의 crud를 거기서 다루도록 하기
// 강의 편집 페이지로 바꾸고 거기서 강의의 crud를 다루도록 하기
export const routers = [
  { name: "학기 추가", link: "/setting/add-semester" },
  { name: "현재 학기 변경", link: "/setting/change-semester" },
  { name: "강의 추가", link: "/setting/add-lecture" },
  // { name: "학기 편집", link: "/setting/delete-semester" },
  { name: "강의정보 변경", link: "/setting/change-lecture" },
  { name: "학기 환급 정책", link: "/setting/refund-policy" },
  { name: "관리자 계정 추가", link: "/setting/add-admin" },
];

export default function SettingIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/setting/add-semester");
  }, []);

  return null;
}
