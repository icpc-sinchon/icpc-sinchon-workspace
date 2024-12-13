import HistoryLayout from "@components/HistoryLayout";
import TableSection from "@ui/TableSection";
import TabNav from "@ui/TabNav";
import TextSection from "@ui/TextSection";
import React from "react";
import type { Semester } from "src/types";
import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getSemesterFromString } from "src/utils/getSemesterFromString";
import { makePageData } from "src/utils/makePageData";

// TODO: 2024 Summer 캠프 데이터 추가
function CampHistoryPage({
  params,
}: {
  params: { semester: string };
}) {
  const { semester } = params;
  const currentPageSemester = getSemesterFromString(semester);
  const {
    allDataRouters,
    selectedTabIndex,
    renderedPageData: campHistoryData,
  } = makePageData(currentPageSemester, "campHistory");

  const currentSeason =
    currentPageSemester.season === "Winter" ? "겨울" : "여름";
  const pageTitle = `${currentPageSemester.year} ${currentPageSemester.season} Algorithm Camp`;
  const pageSubTitle = `${currentPageSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프`;

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
        {campHistoryData.study.length ? null : (
          <TextSection
            title="안내"
            text={`아직 ${currentPageSemester.year} ${currentPageSemester.season} 시즌이 진행되지 않았습니다. 역대 캠프 정보는 상단의 탭을 참고해주세요.`}
          />
        )}
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

export async function generateStaticParams() {
  const allSemesters = getAllSemesterRouters();
  return allSemesters.map((semester) => ({
    params: { semester: `${semester.year}-${semester.season}` },
  }));
}
