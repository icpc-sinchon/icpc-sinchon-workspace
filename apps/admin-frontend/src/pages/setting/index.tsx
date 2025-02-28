import { useEffect } from "react";
import { useRouter } from "next/router";

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
  }, [router]);

  return null;
}
