import TabNav from "@ui/TabNav";
import type { Semester } from "src/types";
import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getCurrentSemester } from "src/utils/getCurrentSemester";
import { getDataFromFile } from "src/utils/getDataFromFile";

async function HallOfFamePage() {
  const { year: currentYear, season: currentSeason } = getCurrentSemester();
  const currentSemester = {
    // year type을 숫자 혹은 문자열로 통일하기
    year: currentYear,
    season: currentSeason,
  } as Semester;
  const semester = `${currentYear}-${currentSeason}`;
  const hallOfFameData = getDataFromFile(
    "hallOfFame",
    currentYear,
    currentSeason,
  );
  const allDataRouters = getAllSemesterRouters("hallOfFame");
  const selectedTabIndex = allDataRouters.findIndex(
    (semester) =>
      semester.year === currentSemester.year &&
      semester.season === currentSemester.season,
  );

  return (
    <div>
      <TabNav
        tabList={allDataRouters}
        currentTabIndex={selectedTabIndex}
        makeTabURL={(semester: Semester) =>
          `/halloffame/${semester.year}-${semester.season}`
        }
        makeTabTitle={(semester: Semester) =>
          `${semester.year} ${semester.season}`
        }
      />
      <h1>역대 {semester} 정보</h1>
      <p>{JSON.stringify(hallOfFameData)}</p>
      <p>{JSON.stringify(allDataRouters)}</p>
    </div>
  );
}

export default HallOfFamePage;
