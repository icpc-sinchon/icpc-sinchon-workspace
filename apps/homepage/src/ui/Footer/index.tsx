import Logo from "@components/Logo";
import * as styles from "./styles.css";
import { getCurrentSemester } from "src/utils/getCurrentSemester";
import { getDataFromFile } from "src/utils/getDataFromFile";
import type { HallOfFame } from "src/types/hallOfFame";
import Link from "next/link";

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

function SNSIcons() {
  return (
    <span className={styles.snsIcons}>
      <Link
        href="https://youtube.com/@icpcsinchonofficial"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/res/footer/youtube.svg" alt="youtube-icon" />
      </Link>
      <Link
        href="https://instagram.com/icpc_sinchon_official"
        target="_blank"
        rel="noreferrer"
      >
        <img src="/res/footer/instagram.svg" alt="instagram-icon" />
      </Link>
      <Link href="https://fb.com/icpc-sinchon" target="_blank" rel="noreferrer">
        <img src="/res/footer/facebook.svg" alt="facebook-icon" />
      </Link>
      <Link
        href="https://pf.kakao.com/_xehxhAK"
        target="_blank"
        rel="noreferrer"
      >
        <img src="/res/footer/talk-gray.svg" alt="kakaotalk-icon" />
      </Link>
      <Link href="mailto:icpc.sinchon@gmail.com">
        <img src="/res/footer/mail-gray.svg" alt="email-icon" />
      </Link>
    </span>
  );
}

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
        <SNSIcons />
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
