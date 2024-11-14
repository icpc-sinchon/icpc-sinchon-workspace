export type Semester = {
  year: number;
  season: "Summer" | "Winter";
};

export type DataType = "campContest" | "campHistory" | "hallOfFame" | "suapc";

export type Person = {
  /**
   * 이름
   */
  name: string;
  /**
   * 소속 학교
   */
  school: string;
  /**
   * BOJ 아이디
   */
  bojHandle: string;
};

export type Manager = {
  /**
   * 기여자의 이름
   */
  name: string;
  /**
   * 기여자의 소속(꼭 학교는 아닐 수도 있음)
   */
  school: string;
  /**
   * 기여자의 역할 표기
   */
  role: string;
};

export interface Sponsor {
  /**
   * 후원사 ID
   */
  id: string;
  /**
   * 후원 이름
   */
  name: string;
  /**
   * 후원 관련 기록
   */
  note?: string[];
}

export type Team = {
  /**
   * 수상 순위
   */
  rank: number;
  /**
   * 수상 팀이 푼 문제 수
   */
  solved: number;
  /**
   * 수상 팀의 이름
   */
  teamName: string;
  /**
   * 수상자의 소속 학교
   */
  school: string;
  /**
   * 수상자들의 이름 배열
   */
  member: string[];
};

export type Problem = {
  /**
   * 문제 제목
   */
  problemTitle: string;
  /**
   * 문제의 BOJ 링크
   */
  link: string;
  /**
   * 문제 출제자
   */
  setter: Person;
};
