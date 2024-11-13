import HistoryLayout from "@components/HistoryLayout";
import ContestLinks from "@ui/ContestLinks";
import TableSection from "@ui/TableSection";
import TabNav from "@ui/TabNav";
import TextSection from "@ui/TextSection";
import { notFound } from "next/navigation";
import React from "react";
import type { Semester } from "src/types";

import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getCurrentSemester } from "src/utils/getCurrentSemester";
import { getDataFromFile } from "src/utils/getDataFromFile";
import { renderCampContestData } from "src/utils/renderCampContestData";

function CampContestIntro({ contestDateTime }: { contestDateTime: string }) {
  return (
    <>
      <TextSection title="콘테스트 일자" text={contestDateTime} />
      <TextSection
        title="캠프 콘테스트 소개"
        text="캠프 콘테스트는 캠프 기간동안 배운 알고리즘을 적용해볼 수 있는 모의고사 형식의 대회입니다. 개인전으로 진행되며, ICPC Sinchon Algorithm Camp 참가자만 참여할 수 있습니다."
      />
      <TextSection
        title="출제 경향"
        text="ICPC Sinchon Algorithm Camp을 통해 학습한 대부분의 알고리즘을 문제로 다루는 것을 목표로 합니다."
      />
    </>
  );
}

// TODO: 2024 Summer 캠프 데이터 추가
function CampContestPage() {
  const currentSemester = getCurrentSemester();
  const allDataRouters = getAllSemesterRouters();
  const selectedTabIndex = allDataRouters.findIndex(
    (semester) =>
      semester.year === currentSemester.year &&
      semester.season === currentSemester.season,
  );

  if (selectedTabIndex === -1) {
    notFound();
  }

  const rawData = getDataFromFile(
    "campContest",
    currentSemester.year,
    currentSemester.season,
  );
  const campContestData = renderCampContestData(rawData);

  const currentSeason = currentSemester.season === "Winter" ? "겨울" : "여름";
  const pageTitle = `${currentSemester.year} ${currentSemester.season} Camp Contest`;
  const pageSubTitle = `${currentSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프 콘테스트`;

  // TODO: note를 적당히 렌더링하기
  if (campContestData.contest.length === 0) {
    return (
      <>
        <TabNav
          tabList={allDataRouters}
          currentTabIndex={selectedTabIndex}
          makeTabURL={(semester: Semester) =>
            `/campcontest/${semester.year}-${semester.season}`
          }
          makeTabTitle={(semester: Semester) =>
            `${semester.year} ${semester.season}`
          }
        />
        <HistoryLayout title={pageTitle} subTitle={pageSubTitle}>
          <CampContestIntro contestDateTime={campContestData.dateTime} />
        </HistoryLayout>
      </>
    );
  }

  const contestLinks = campContestData.links
    ? [
        {
          title: "문제(BOJ 링크)",
          href: campContestData.links.problemBojLink ?? "",
        },
        {
          title: "해설 PDF",
          href: campContestData.links.solutionPdf
            ? `/res/${currentSemester.year}${
                currentSemester.season === "Winter" ? "w" : "s"
              }/${campContestData.links.solutionPdf}`
            : "",
        },
        {
          title: "초급 스코어보드",
          href: campContestData.links.scoreboard?.[0] ?? "",
        },
        {
          title: "중급 스코어보드",
          href: campContestData.links.scoreboard?.[1] ?? "",
        },
      ].filter((link) => link.href) // 유효한 링크만 포함
    : [];

  // TODO: DataTable의 width 배열 props 등을 통해서 표의 각 열의 너비를 조절할 수 있도록 하기
  return (
    <>
      <TabNav
        tabList={allDataRouters}
        currentTabIndex={selectedTabIndex}
        makeTabURL={(semester: Semester) =>
          `/campcontest/${semester.year}-${semester.season}`
        }
        makeTabTitle={(semester: Semester) =>
          `${semester.year} ${semester.season}`
        }
      />
      <HistoryLayout title={pageTitle} subTitle={pageSubTitle}>
        {campContestData.links && <ContestLinks links={contestLinks} />}
        <CampContestIntro contestDateTime={campContestData.dateTime} />
        {campContestData.contest.map((contest) => (
          <React.Fragment key={contest.level}>
            <TableSection
              title={`${contest.contestName} 수상자`}
              titleBadge={contest.level}
              data={contest.awards}
              columns={[
                { key: "rank", header: "순위" },
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ 핸들" },
                { key: "school", header: "소속" },
              ]}
              fixedLayout
            />
            {contest.problemPicker && (
              <TableSection
                title={`${contest.contestName} 문제 선정자`}
                titleBadge={contest.level}
                data={contest.problemPicker}
                columns={[
                  { key: "name", header: "이름" },
                  { key: "bojHandle", header: "BOJ 핸들" },
                  { key: "school", header: "소속" },
                ]}
                fixedLayout
              />
            )}
            {contest.problemList && (
              <TableSection
                title={`${contest.contestName} 문제 목록`}
                titleBadge={contest.level}
                data={contest.problemList.map((problem, index) => ({
                  ...problem,
                  problemIndex: String.fromCharCode(65 + index),
                }))}
                columns={[
                  { header: "#", key: "problemIndex" },
                  { header: "문제", key: "link" },
                  { header: "출제자", key: "setter" },
                  { header: "소속", key: "setterSchool" },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </HistoryLayout>
    </>
  );
}

export default CampContestPage;
