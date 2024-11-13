import type { HallOfFame } from "src/types/hallOfFame";
import { renderPerson } from "./renderHelpers";

function renderContributor(data: HallOfFame["campContributor"][number]) {
  const formattedData = {
    level: data.level,
    lecturer: data.lecturer.map(renderPerson),
    ...(data.mentor && {
      mentor: data.mentor.map(renderPerson),
    }),
  };

  return formattedData;
}

export const renderHallOfFameData = (data: HallOfFame) => {
  const formattedData = {
    ...data,
    campContributor: data.campContributor.map((camp) =>
      renderContributor(camp),
    ),
  };
  return formattedData;
};
