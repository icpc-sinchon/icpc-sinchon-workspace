import type { CampHistory } from "src/types/campHistory";
import { renderPerson } from "./renderHelpers";

export const renderCampHistoryData = (data: CampHistory) => {
  const renderData = {
    ...data,
    study: data.study.map((s) => ({
      ...s,
      lecturer: s.lecturer.map(renderPerson),
      mentor: s.mentor?.map(renderPerson),
    })),
  };
  return renderData;
};
