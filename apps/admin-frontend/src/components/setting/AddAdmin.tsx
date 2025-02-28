import { useState } from "react";
import axios from "axios";
import { SettingTab } from "@/components/setting/SettingItem";
import Input from "@/components/Input";
import ErrorMessage from "../ErrorMessage";
import { registerAPI } from "@/utils/auth";
import { API_URL } from "@/types/apis";

type Admin = {
  username: string;
  password: string;
  passwordCheck: string;
};

function AddNewAdmin() {
  const [newAdmin, setNewAdmin] = useState<Admin>({
    username: "",
    password: "",
    passwordCheck: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (newAdmin.password !== newAdmin.passwordCheck) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      setNewAdmin({ username: "", password: "", passwordCheck: "" });
      // 인증 상태를 다시 확인하여 UI를 업데이트합니다.
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "관리자 계정 추가에 실패했습니다.",
        );
      } else {
        setError("관리자 계정 추가 중 오류가 발생했습니다.");
      }
    }
  };

  // TODO: 실패 시 에러 토스트를 표시하도록 수정
  return (
    <SettingTab
      tabTitle="관리자 계정 추가"
      onSubmit={handleSubmit}
      confirmMessage={`아이디: ${newAdmin.username}\n비밀번호: ${newAdmin.password} 로 관리자 계정을 추가하시겠습니까?`}
    >
      <h1>작동하지 않음</h1>
      <Input
        label="관리자 아이디"
        name="username"
        placeholder="icpc-sinchon"
        value={newAdmin.username}
        onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
      />
      {/* 비밀번호 확인 값과 대조하는 로직 필요 */}
      <Input
        label="비밀번호"
        name="password"
        type="password"
        value={newAdmin.password}
        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
      />
      <Input
        label="비밀번호 확인"
        name="passwordCheck"
        type="password"
        value={newAdmin.passwordCheck}
        onChange={(e) =>
          setNewAdmin({ ...newAdmin, passwordCheck: e.target.value })
        }
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SettingTab>
  );
}
export default AddNewAdmin;
