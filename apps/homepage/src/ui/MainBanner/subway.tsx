import * as styles from "./subwayStyles.css";

type Station = {
  id: string;
  name: string;
  color: string;
};

type SchoolProps = {
  logoImage: string;
  station: Station;
  clubName: string;
};

const schools: SchoolProps[] = [
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

function SchoolNode({ logoImage, clubName }: SchoolProps) {
  return (
    <div className={styles.schoolNode}>
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

function SubwayLine() {
  const points = [
    { x: "2%", y: "10" },
    { x: "25%", y: "10" },
    { x: "50%", y: "10" },
    { x: "75%", y: "10" },
    { x: "98%", y: "10" },
  ];

  const lineColors = ["#77C4A3", "#00A4E3", "#00A84D", "#00A84D"];

  // TODO: svg 너비 조정
  // 각 학교 학회 페이지 링크 추가
  // 모바일 환경에서는 지하철 노선도를 숨기고 학교 명단을 flex-wrap으로 변경
  return (
    <div className={styles.subwayContainer}>
      <div className={styles.subwayLine}>
        {schools.map((school) => (
          <SchoolNode key={school.clubName} {...school} />
        ))}
      </div>
      <svg
        width="100%"
        height="30"
        preserveAspectRatio="xMidYMid meet"
        className={styles.subwayLineContainer}
      >
        <title>지하철 노선도</title>
        {points.slice(0, -1).map((point, index) => (
          <line
            key={`line-${index}`}
            x1={point.x}
            y1={point.y}
            x2={points[index + 1].x}
            y2={points[index + 1].y}
            stroke={lineColors[index]}
            strokeWidth="6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {points.map((point, index) => (
          <circle
            key={`dot-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="white"
            stroke="#2D3748"
            strokeWidth="1"
          />
        ))}
      </svg>
      <div className={styles.subwayLine}>
        {schools.map((school, index) => (
          <StationNode key={`station-${index}`} {...school.station} />
        ))}
      </div>
    </div>
  );
}

function Connection() {
  return (
    <>
      <SubwayLine />
    </>
  );
}

export default Connection;
