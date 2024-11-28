// converted json schema to typescript using https://transform.tools/json-schema-to-typescript

import type { Manager, Person } from ".";

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
  president?: Manager[];
  /**
   * 해당 시기의 운영진
   */
  manager: Manager[];
  /**
   * 기타 부분에서 캠프에 기여한 사람들
   */
  contributor?: Manager[];
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
    lecturer: Person[];
    /**
     * 알고리즘 캠프 멘토 명단
     */
    mentor?: Person[];
  }[];
  [k: string]: unknown;
}
