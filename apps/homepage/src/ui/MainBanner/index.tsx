import HeroTitle from "@components/HeroTitle";
import * as styles from "./styles.css";
import Text from "@components/Text";

type Station = {
  id: string;
  name: string;
  color: string;
};

type School = {
  logoImage: string;
  station: Station;
  clubName: string;
};

const schools: School[] = [
  {
    logoImage: "/school-logo/sogang.png",
    station: {
      id: "K313",
      name: "서강대",
      color: "#77C4A3",
    },
    clubName: "Sogang ICPC Team",
  },
  {
    logoImage: "/school-logo/sookmyung.png",
    station: {
      id: "427",
      name: "숙대입구",
      color: "#00A4E3",
    },
    clubName: "Algos",
  },
  {
    logoImage: "/school-logo/yonsei.png",
    station: {
      id: "240",
      name: "신촌",
      color: "#00A84D",
    },
    clubName: "Molgorithm",
  },
  {
    logoImage: "/school-logo/ewha.png",
    station: {
      id: "241",
      name: "이대",
      color: "#00A84D",
    },
    clubName: "EDOC",
  },
  {
    logoImage: "/school-logo/hongik.png",
    station: {
      id: "239",
      name: "홍대입구",
      color: "#00A84D",
    },
    clubName: "HI-ARC",
  },
];

const subwayStationPoints = [
  { x: "2%", y: "10" },
  { x: "25%", y: "10" },
  { x: "50%", y: "10" },
  { x: "75%", y: "10" },
  { x: "98%", y: "10" },
];

const subwayLineColors = ["#77C4A3", "#00A4E3", "#00A84D", "#00A84D"];

function SchoolNode({ logoImage, clubName }: School) {
  return (
    <div className={styles.schoolContainer}>
      <div className={styles.logoContainer}>
        <img src={logoImage} alt={clubName} className={styles.logo} />
      </div>
      <p className={styles.clubName}>{clubName}</p>
    </div>
  );
}

function StationNode({ id, name, color }: Station) {
  return (
    <div className={styles.stationContainer}>
      <div className={styles.station} style={{ backgroundColor: color }}>
        {id}
      </div>
      <p>{name}</p>
    </div>
  );
}

function SinchonSubwayLine() {
  // TODO: svg 너비 조정
  // 각 학교 학회 페이지 링크 추가
  // 모바일 환경에서는 지하철 노선도를 숨기고 학교 명단을 flex-wrap으로 변경
  return (
    <svg
      width="100%"
      height="30"
      preserveAspectRatio="xMidYMid meet"
      className={styles.subwayLineContainer}
    >
      <title>지하철 노선도</title>
      {subwayStationPoints.slice(0, -1).map((point, index) => (
        <line
          key={point.x}
          x1={point.x}
          y1={point.y}
          x2={subwayStationPoints[index + 1].x}
          y2={subwayStationPoints[index + 1].y}
          stroke={subwayLineColors[index]}
          strokeWidth="6"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {subwayStationPoints.map((point) => (
        <circle
          key={point.x}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="white"
          stroke="#2D3748"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function MainBanner() {
  return (
    <section className={styles.container}>
      <HeroTitle>ICPC Sinchon</HeroTitle>
      <div className={styles.textContainer}>
        <Text>신촌지역 5개 대학의 알고리즘 동아리들의 연합입니다.</Text>
        <Text>알고리즘 캠프, 대회 등 다양한 활동을 진행하고 있습니다.</Text>
      </div>
      <div className={styles.subwayContainer}>
        <div className={styles.nodeContainer}>
          {schools.map((school) => (
            <SchoolNode key={school.clubName} {...school} />
          ))}
        </div>
        <SinchonSubwayLine />
        <div className={styles.nodeContainer}>
          {schools.map((school) => (
            <StationNode key={school.clubName} {...school.station} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MainBanner;
