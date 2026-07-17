import type { Semester } from "src/types";

// 유의사항 본문(notice/content.md)은 시즌별로 나뉘어 있지 않고 한 파일을 공유한다.
// 따라서 그 본문이 가리키는 시즌에서만 유의사항 페이지를 노출한다.
// 새 시즌 유의사항을 작성하면 content.md를 갱신하고 이 목록에 시즌을 추가한다.
const NOTICE_SEMESTERS: Semester[] = [{ year: 2026, season: "Winter" }];

export function hasNoticePage(semester: Semester) {
  return NOTICE_SEMESTERS.some(
    (noticeSemester) =>
      noticeSemester.year === semester.year &&
      noticeSemester.season === semester.season,
  );
}
