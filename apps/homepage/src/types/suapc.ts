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
