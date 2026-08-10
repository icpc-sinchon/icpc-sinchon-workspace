import fs from "node:fs";
import path from "node:path";
import type { SUAPCData } from "src/types/suapc";
import { formatLinkURL } from "./formatLinkURL";
import { getCurrentSemester } from "./getCurrentSemester";
import { getDataFromFile } from "./getDataFromFile";

export type PromotionData = {
  // 팝업을 다시 보지 않기로 한 기록을 시즌별로 남기기 위한 식별자
  promotionId: string;
  contestTitle: string;
  contestPageURL: string;
  dateTime: string;
  // 아직 준비되지 않은 값은 빈 문자열이다
  posterURL: string;
  applyLink: string;
  applyPeriod: string;
  showPopup: boolean;
};

// 현재 시즌 데이터에 promotion이 있을 때만 홍보 영역과 팝업을 노출한다.
// 홍보가 끝나면 데이터 파일에서 promotion을 지운다.
export function getPromotionData(): PromotionData | null {
  const semester = getCurrentSemester();
  const dataFilePath = path.join(
    process.cwd(),
    "..",
    "..",
    "libs",
    "data",
    "suapc",
    `${semester.year}-${semester.season}.json`,
  );

  if (!fs.existsSync(dataFilePath)) {
    return null;
  }

  const suapcData: SUAPCData = getDataFromFile(
    "suapc",
    semester.year,
    semester.season,
  );
  const promotion = suapcData.promotion;

  if (!promotion) {
    return null;
  }

  return {
    promotionId: `${semester.year}-${semester.season}`,
    contestTitle: `SUAPC ${semester.year} ${semester.season}${suapcData.titleSuffix ? ` ${suapcData.titleSuffix}` : ""}`,
    contestPageURL: `/suapc/${semester.year}-${semester.season}`,
    dateTime: suapcData.dateTime,
    posterURL: formatLinkURL(promotion.posterImage, semester),
    applyLink: promotion.applyLink ?? "",
    applyPeriod: promotion.applyPeriod ?? "",
    showPopup: promotion.showPopup ?? false,
  };
}
