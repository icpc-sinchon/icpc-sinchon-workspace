import HistoryLayout from "@components/HistoryLayout";
import TableSection from "@ui/TableSection";
import TabNav from "@ui/TabNav";
import TextSection from "@ui/TextSection";
import React from "react";
import type { Semester } from "src/types";
import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getCurrentSemester } from "src/utils/getCurrentSemester";
import { getDataFromFile } from "src/utils/getDataFromFile";
import { renderCampHistoryData } from "src/utils/renderCampHistoryData";

function CampHistoryPage() {
  const currentSemester = getCurrentSemester();
  const allDataRouters = getAllSemesterRouters();
  const selectedTabIndex = allDataRouters.findIndex(
    (semester) =>
      semester.year === currentSemester.year &&
      semester.season === currentSemester.season,
  );

  const rawData = getDataFromFile(
    "campHistory",
    currentSemester.year,
    currentSemester.season,
  );
  const campHistoryData = renderCampHistoryData(rawData);

  const currentSeason = currentSemester.season === "Winter" ? "겨울" : "여름";
  const pageTitle = `${currentSemester.year} ${currentSemester.season} Algorithm Camp`;
  const pageSubTitle = `${currentSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프`;

  return (
    <>
      <TabNav
        tabList={allDataRouters}
        currentTabIndex={selectedTabIndex}
        makeTabURL={(semester: Semester) =>
          `/camphistory/${semester.year}-${semester.season}`
        }
        makeTabTitle={(semester: Semester) =>
          `${semester.year} ${semester.season}`
        }
      />
      <HistoryLayout title={pageTitle} subTitle={pageSubTitle}>
        <TextSection
          title="알고리즘 캠프 소개"
          text="ICPC Sinchon에서는 매 시즌 참가자들의 개인적인 성장을 위해 알고리즘
          캠프를 개최하고 있습니다. 각 시즌의 알고리즘 캠프에 기여해 주신 분들과
          커리큘럼을 기록합니다."
        />
        {campHistoryData.study.map((campStudy) => (
          <React.Fragment key={campStudy.level}>
            {campStudy.lecturer && (
              <TableSection
                key={`camp-lecturer-${campStudy.level}`}
                title="캠프 강사"
                titleBadge={campStudy.level}
                data={campStudy.lecturer}
                columns={[
                  { key: "name", header: "이름" },
                  { key: "bojHandle", header: "BOJ" },
                  { key: "school", header: "학교" },
                ]}
                fixedLayout
              />
            )}
            {campStudy.mentor && (
              <TableSection
                key={`camp-mentor-${campStudy.level}`}
                title="캠프 멘토"
                titleBadge={campStudy.level}
                data={campStudy.mentor}
                columns={[
                  { key: "name", header: "이름" },
                  { key: "bojHandle", header: "BOJ" },
                  { key: "school", header: "학교" },
                ]}
                fixedLayout
              />
            )}
            {campStudy.curriculum && (
              <TableSection
                key={`camp-curriculum-${campStudy.level}`}
                title="캠프 커리큘럼"
                titleBadge={campStudy.level}
                data={campStudy.curriculum.map((curriculum, index) => ({
                  session: `${index + 1}회차`,
                  content: curriculum,
                }))}
                columns={[
                  { key: "session", header: "회차" },
                  { key: "content", header: "강의 주제" },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </HistoryLayout>
    </>
  );
}

export default CampHistoryPage;
