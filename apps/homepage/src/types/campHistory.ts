import type { Person } from ".";

/**
 * 신촌연합 알고리즘 캠프의 운영을 기록한 데이터 스키마
 */
export interface CampHistory {
  /**
   * 알고리즘 캠프가 진행된 연도
   */
  year: number;
  /**
   * 알고리즘 캠프가 진행된 계절(여름, 겨울 중 하나)
   */
  season: "Winter" | "Summer";
  /**
   * 알고리즘 캠프 난이도별 스터디
   */
  study: {
    /**
     * 스터디의 난이도
     */
    level: "초급" | "중급" | "고급";
    /**
     * 스터디의 강사
     */
    lecturer: Person[];
    /**
     * 스터디의 멘토
     */
    mentor?: Person[];
    /**
     * 스터디의 커리큘럼
     */
    curriculum: string[];
  }[];
}
