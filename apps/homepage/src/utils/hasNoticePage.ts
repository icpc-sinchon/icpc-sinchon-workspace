import fs from "node:fs";
import path from "node:path";
import type { Semester } from "src/types";

// 유의사항 본문은 시즌별 마크다운 파일로 관리한다.
// 새 시즌 유의사항은 이 폴더에 {연도}-{계절}.md를 추가하면 페이지가 함께 열린다.
export function getNoticeContentPath(semester: Semester) {
  return path.join(
    process.cwd(),
    "src",
    "app",
    "suapc",
    "[semester]",
    "notice",
    `${semester.year}-${semester.season}.md`,
  );
}

export function hasNoticePage(semester: Semester) {
  return fs.existsSync(getNoticeContentPath(semester));
}
