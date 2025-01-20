import Head from "next/head";
import styled from "styled-components";
import { ChangeEvent, FormEvent, useState } from "react";
import Spinner from "@/components/Spinner";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import ErrorMessage from "@/components/ErrorMessage";

type UserInfo = {
  id: string;
  password: string;
};

function Login() {
  const [userInfo, setUserInfo] = useState<UserInfo>({ id: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!userInfo.id.trim() || !userInfo.password.trim()) {
      setError("아이디와 비밀번호를 모두 입력해 주세요");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userInfo);
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      await login(userInfo.id, userInfo.password);
    } catch (err) {
      if (err.response.status === 401) {
        setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <OuterWrap>
        <InnerWrap>
          <Title>Loading...</Title>
          <Spinner />
        </InnerWrap>
      </OuterWrap>
    );
  }

  return (
    <>
      <Head>
        <title>로그인 | ICPC Admin</title>
      </Head>
      <OuterWrap>
        <InnerWrap>
          <form onSubmit={handleSubmit}>
            <Title>
              ICPC Sinchon <br />
              관리자 페이지
            </Title>
            <InputWrap>
              <Input
                type="text"
                name="id"
                label="아이디"
                placeholder="아이디"
                value={userInfo.id}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <Input
                type="password"
                name="password"
                label="비밀번호"
                placeholder="비밀번호"
                value={userInfo.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
              <InputSubmit type="submit" disabled={isLoading}>
                {isLoading ? "로그인 진행중..." : "로그인"}
              </InputSubmit>
            </InputWrap>
          </form>
        </InnerWrap>
      </OuterWrap>
    </>
  );
}

export default Login;

const OuterWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerWrap = styled.div`
  width: 92%;
  max-width: 25rem;
  padding: ${(props) => props.theme.spacing[6]};
  background: ${(props) => props.theme.colors.boxBackground};
  border-radius: ${(props) => props.theme.radius[6]};
  box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;
`;

const Title = styled.h2`
  margin: ${(props) => props.theme.spacing[0]};
  margin-bottom: ${(props) => props.theme.spacing[6]};
  font-size: 1.5rem;
  line-height: 30px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primarySurface};
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing[4]};
`;

const InputSubmit = styled.button`
  border: none;

  width: 100%;
  height: 2.5rem;

  border-radius: ${(props) => props.theme.radius[4]};

  background: ${(props) => props.theme.colors.primarySurface};
  color: ${(props) => props.theme.colors.secondaryText};

  cursor: pointer;
  outline: none;
`;
