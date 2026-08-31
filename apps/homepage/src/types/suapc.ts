import type { Person, Problem, Sponsor, Team } from ".";

/**
 * 신촌지역 대학교 프로그래밍 동아리 연합대회(Sinchon University Association Programming Contest) 기록을 담은 데이터 스키마
 */
export interface SUAPCData {
  /**
   * 연합 대회가 진행된 연도
   */
  year: number;
  /**
   * 연합 대회가 진행된 계절(여름, 겨울 중 하나)
   */
  season: "Winter" | "Summer";
  /**
   * 연합 대회가 진행된 날짜와 시간
   */
  dateTime: string;
  /**
   * 대회에 관련된 사항. 이때 특별했던 시기적 이슈 등을 기록
   */
  note?: string;
  /**
   * 대회 타이틀 뒤에 덧붙일 문구(예: "× Dify Hackathon")
   */
  titleSuffix?: string;
  /**
   * 대회 홍보 정보. 홍보 기간에만 사용하고, 대회가 끝나면 지운다
   */
  promotion?: Promotion;
  /**
   * 연합 대회 관련 링크
   */
  links: {
    /**
     * 캠프 콘테스트의 문제 BOJ 링크
     */
    problemBojLink?: string;
    /**
     * 캠프 콘테스트의 문제 PDF 링크
     */
    problemPdf?: string;
    /**
     * 캠프 콘테스트의 솔루션 PDF 링크
     */
    solutionPdf?: string;
    /**
     * 캠프 콘테스트의 스코어보드 링크들. div1, div2가 있던 시절을 대비해 배열로 처리
     */
    scoreboard?: [string] | [string, string] | [string, string, string];
    /**
     * 연합 대회의 공식 포스터 이미지 링크
     */
    posterImage?: string;
  };
  /**
   * SUAPC 대회 목록
   */
  contest: Contest[];
  /**
   * SUAPC 문제 출제자
   */
  setter: Person[];
  /**
   * SUAPC 문제 검수자
   */
  reviewer: Person[];
  /**
   * SUAPC 후원사
   */
  sponsor: Sponsor[];
  /**
   * SUAPC의 개인 후원자
   */
  personalSponsor?: Sponsor[];
  /**
   * 본대회와 별도로 진행한 해커톤 기록
   */
  hackathon?: Hackathon;
}
export interface Hackathon {
  /**
   * 해커톤 이름
   */
  name: string;
  /**
   * 해커톤 문제 PDF 링크
   */
  problemPdf?: string;
  /**
   * 해커톤 스코어보드
   */
  scoreboard: HackathonScore[];
}
export interface HackathonScore {
  /**
   * 해커톤 등수
   */
  rank: number;
  /**
   * 참가자 닉네임
   */
  nickname: string;
  /**
   * 총점. 소수점 표기를 유지하기 위해 문자열로 둔다
   */
  score: string;
  /**
   * 문제별 점수. A번부터 순서대로 담는다
   */
  problemScores: number[];
  /**
   * 제출까지 걸린 시간(초)
   */
  time: number;
}
export interface Promotion {
  /**
   * 4:5 비율의 홍보 포스터 이미지. http로 시작하지 않으면 시즌별 폴더(/res/2026s 등)에서 찾는다
   */
  posterImage?: string;
  /**
   * 참가 신청 폼(구글 폼) 링크
   */
  applyLink?: string;
  /**
   * 참가 신청 기간 안내 문구
   */
  applyPeriod?: string;
  /**
   * 홈페이지 접속 시 홍보 팝업을 띄울지 여부
   */
  showPopup?: boolean;
}
export interface Contest {
  /**
   * Div1, Div2 등 캠프 콘테스트의 별칭. 없으면 null
   */
  contestName: string | null;
  /**
   * SUAPC 수상 팀들
   */
  awards: Team[];
  /**
   * SUAPC 문제 리스트
   */
  problemList: Problem[];
}
