import HistoryLayout from "@components/HistoryLayout";
import TabNav from "@ui/TabNav";
import type { Semester } from "src/types";
import { renderHallOfFameData } from "src/utils/renderHallOfFameData";
import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getCurrentSemester } from "src/utils/getCurrentSemester";
import { getDataFromFile } from "src/utils/getDataFromFile";
import TextSection from "@ui/TextSection";
import React from "react";
import TableSection from "@ui/TableSection";

function HallOfFamePage() {
  const currentSemester = getCurrentSemester();
  const rawData = getDataFromFile(
    "hallOfFame",
    currentSemester.year,
    currentSemester.season,
  );
  const hallOfFameData = renderHallOfFameData(rawData);
  const allDataRouters = getAllSemesterRouters();
  const selectedTabIndex = allDataRouters.findIndex(
    (semester) =>
      semester.year === currentSemester.year &&
      semester.season === currentSemester.season,
  );

  const currentSeason = currentSemester.season === "Winter" ? "겨울" : "여름";

  const pageTitle = `${currentSemester.year} ${currentSemester.season} HALL OF FAME`;
  const pageSubTitle = `${currentSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 명예의 전당`;

  return (
    <>
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
      <HistoryLayout title={pageTitle} subTitle={pageSubTitle}>
        <TextSection
          title="명예의 전당 소개"
          text="ICPC Sinchon에서 SUAPC, Algorithm Camp의 운영을 맡아 주신 운영진
          분들과 Algorithm Camp에서 강의와 알고리즘 캠프 멘토 활동으로
          기여해주신 분들을 기립니다."
        />
        {hallOfFameData.president && (
          <TableSection
            title="회장"
            data={hallOfFameData.president}
            columns={[
              { key: "role", header: "직책" },
              { key: "name", header: "이름" },
              { key: "school", header: "학교" },
            ]}
            fixedLayout
          />
        )}
        {hallOfFameData.manager && (
          <TableSection
            title="운영진"
            data={hallOfFameData.manager}
            columns={[
              { key: "role", header: "직책" },
              { key: "name", header: "이름" },
              { key: "school", header: "학교" },
            ]}
            fixedLayout
          />
        )}
        {hallOfFameData.contributor && (
          <TableSection
            title="기타 기여자"
            data={hallOfFameData.contributor}
            columns={[
              { key: "role", header: "직책" },
              { key: "name", header: "이름" },
              { key: "school", header: "학교" },
            ]}
            fixedLayout
          />
        )}
        {hallOfFameData.campContributor.map((camp) => (
          <React.Fragment key={camp.level}>
            {camp.lecturer && (
              <TableSection
                title="알고리즘 캠프 강사"
                titleBadge={camp.level}
                data={camp.lecturer}
                columns={[
                  { key: "name", header: "이름" },
                  { key: "bojHandle", header: "BOJ" },
                  { key: "school", header: "학교" },
                ]}
                fixedLayout
              />
            )}
            {camp.mentor && (
              <TableSection
                title="알고리즘 캠프 멘토"
                titleBadge={camp.level}
                data={camp.mentor}
                columns={[
                  { key: "name", header: "이름" },
                  { key: "bojHandle", header: "BOJ" },
                  { key: "school", header: "학교" },
                ]}
                fixedLayout
              />
            )}
          </React.Fragment>
        ))}
      </HistoryLayout>
    </>
  );
}

export default HallOfFamePage;
