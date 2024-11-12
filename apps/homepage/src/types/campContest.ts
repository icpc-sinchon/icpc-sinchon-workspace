/**
 * 신촌연합 알고리즘 캠프의 캠프 콘테스트 기록을 담은 데이터 스키마
 */
export interface CampContest {
  /**
   * 알고리즘 캠프가 진행된 연도
   */
  year: number;
  /**
   * 알고리즘 캠프가 진행된 계절(여름, 겨울 중 하나)
   */
  season: "Winter" | "Summer";
  /**
   * 캠프 콘테스트가 진행된 날짜와 시간
   */
  dateTime: string;
  /**
   * 캠프 콘테스트에 관련된 사항. 이때 특별했던 이슈 등을 기록(problemPicker 문제 선정자의 존재 등)
   */
  note?: string;
  /**
   * 캠프 콘테스트 관련 링크
   */
  links: {
    /**
     * 캠프 콘테스트의 문제 BOJ 링크
     */
    problemBojLink?: string;
    /**
     * 캠프 콘테스트의 솔루션 PDF 링크
     */
    solutionPdf?: string;
    /**
     * 캠프 콘테스트의 스코어보드 링크. 첫번째는 초급, 두번째는 중급...
     */
    scoreboard?: [string] | [string, string] | [string, string, string];
    [k: string]: unknown;
  };
  /**
   * 캠프 콘테스트의 정보
   */
  contest?: {
    /**
     * 캠프 콘테스트의 난이도
     */
    level?: "초급" | "중급" | "고급";
    /**
     * 중간고사, 기말고사 등 캠프 콘테스트의 별칭
     */
    contestName?: string;
    /**
     * 문제 선정자. 신촌연합 초기에는 콘테스트가 백준에서 문제를 뽑아 진행되었는데 이때 문제를 선정한 사람들
     */
    problemPicker?: {
      /**
       * 문제 선정자의 이름
       */
      name: string;
      /**
       * 문제 선정자의 소속 학교
       */
      school: string;
      /**
       * 문제 선정자의 BOJ 핸들
       */
      bojHandle: string;
      [k: string]: unknown;
    }[];
    /**
     * 캠프 콘테스트의 수상자들
     */
    awards?: {
      /**
       * 수상 순위
       */
      rank: number;
      /**
       * 수상자의 이름
       */
      name: string;
      /**
       * 수상자의 소속 학교
       */
      school: string;
      /**
       * 수상자의 BOJ 핸들
       */
      bojHandle: string;
      [k: string]: unknown;
    }[];
    /**
     * 캠프 콘테스트의 문제 리스트
     */
    problemList?: {
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
      setter: {
        /**
         * 문제 출제자의 이름
         */
        name: string;
        /**
         * 문제 출제자의 소속 학교
         */
        school: string;
        /**
         * 문제 출제자의 BOJ 핸들
         */
        bojHandle: string;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
