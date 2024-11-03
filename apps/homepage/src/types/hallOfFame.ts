// converted json schema to typescript using https://transform.tools/json-schema-to-typescript
/**
 * 신촌연합 알고리즘 캠프의 운영진, 기여자들을 기리는 명예의 전당 데이터 스키마
 */
export interface HallOfFame {
  /**
   * 알고리즘 캠프가 진행된 연도
   */
  year: number;
  /**
   * 알고리즘 캠프가 진행된 계절(여름, 겨울 중 하나)
   */
  season: "Winter" | "Summer";
  /**
   * 알고리즘 캠프가 진행된 기간
   */
  duration: string;
  /**
   * 해당 시기의 회장(회장이 여러 명인 경우도 있음)
   */
  president?: {
    /**
     * 캠프 회장의 이름
     */
    name: string;
    /**
     * 회장이 소속된 학교
     */
    school: string;
    /**
     * 회장의 역할 표기(일반적으로 회장)
     */
    role: string;
  }[];
  /**
   * 해당 시기의 운영진
   */
  manager: {
    /**
     * 운영진의 이름
     */
    name: string;
    /**
     * 운영진이 소속된 학교
     */
    school: string;
    /**
     * 운영진의 역할 표기
     */
    role: string;
  }[];
  /**
   * 기타 부분에서 캠프에 기여한 사람들
   */
  contributor?: {
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
  }[];
  /**
   * 해당 시기의 알고리즘 캠프에 강사, 멘토 등으로 기여한 사람들
   */
  campContributor: {
    /**
     * 캠프 난이도
     */
    level: "초급" | "중급" | "고급";
    /**
     * 알고리즘 캠프 강사 명단
     */
    lecturer: {
      /**
       * 강사의 이름
       */
      name: string;
      /**
       * 강사의 소속(꼭 학교는 아닐 수도 있음)
       */
      school: string;
      /**
       * 강사의 BOJ 핸들
       */
      bojHandle: string;
    }[];
    /**
     * 알고리즘 캠프 멘토 명단
     */
    mentor?: {
      /**
       * 멘토의 이름
       */
      name: string;
      /**
       * 멘토의 소속(꼭 학교는 아닐 수도 있음)
       */
      school: string;
      /**
       * 멘토의 BOJ 핸들
       */
      bojHandle: string;
    }[];
  }[];
  [k: string]: unknown;
}
