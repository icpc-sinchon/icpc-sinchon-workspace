// TODO: current semester 설정해서 footer에 쓰일 정보를 가져오게 수정
import Logo from "@components/Logo";
import * as styles from "./styles.css";
import { mockData } from "./mock";

type Manager = {
  name: string;
  school: string;
  role: string;
};

const makeNameList = (list: Manager[]) => list.map((m) => m.name).join(" | ");

function OrgTitle({ children }) {
  return <h2 className={styles.orgTitle}>{children}</h2>;
}

function OrgDescription({ children }) {
  return <p className={styles.orgDescription}>{children}</p>;
}

// DB에 저장된 정보를 쓰거나 아니면 current semester json 파일을 사용
function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.container}>
        <Logo />
        <OrgTitle>신촌지역 대학교 프로그래밍 동아리 연합</OrgTitle>
        <br />
        <OrgTitle>회장</OrgTitle>
        <OrgDescription>{makeNameList(mockData.president)}</OrgDescription>
        <OrgTitle>운영진</OrgTitle>
        <OrgDescription>{makeNameList(mockData.manager)}</OrgDescription>
        <br />
        <OrgDescription>
          04107 서울시 마포구 백범로 35 (신수동) 서강대학교 김대건관(K관) 512호
          | icpc.sinchon@gmail.com
        </OrgDescription>
        <OrgDescription>© ICPC Sinchon. All Rights Reserved.</OrgDescription>
      </div>
    </footer>
  );
}

export default Footer;
