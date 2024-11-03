import Logo from "@components/Logo";
import * as styles from "./styles.css";
import { getCurrentSemester } from "src/utils/getCurrentSemester";
import { getDataFromFile } from "src/utils/getDataFromFile";
import type { HallOfFame } from "src/types/hallOfFame";

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
  const currentSemester = getCurrentSemester();
  const hallOfFameData: HallOfFame = getDataFromFile(
    "hallOfFame",
    currentSemester.year,
    currentSemester.season,
  );
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.container}>
        <Logo />
        <OrgTitle>신촌지역 대학교 프로그래밍 동아리 연합</OrgTitle>
        <br />
        <OrgTitle>회장</OrgTitle>
        <OrgDescription>
          {makeNameList(hallOfFameData.president)}
        </OrgDescription>
        <OrgTitle>운영진</OrgTitle>
        <OrgDescription>{makeNameList(hallOfFameData.manager)}</OrgDescription>
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
