import { title } from "@components/HeroTitle/styles.css";
import HistoryLayout from "@components/HistoryLayout";
import LinkButton from "@components/LinkButton";
import DataTable from "@components/Table";
import Text from "@components/Text";
import Title from "@components/Title";
import ContestLinks from "@ui/ContestLinks";
import TabNav from "@ui/TabNav";
import { notFound } from "next/navigation";
import type { Semester } from "src/types";

import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getDataFromFile } from "src/utils/getDataFromFile";
import { getSemesterFromString } from "src/utils/getSemesterFromString";
import { renderCampContestData } from "src/utils/renderCampContestData";
import { renderCampHistoryData } from "src/utils/renderCampHistoryData";

// TODO: 2024 Summer 캠프 데이터 추가
function CampContestPage({
  params,
}: {
  params: { semester: string };
}) {
  const { semester } = params;
  const currentPageSemester = getSemesterFromString(semester);
  const allDataRouters = getAllSemesterRouters();
  const selectedTabIndex = allDataRouters.findIndex(
    (semester) =>
      semester.year === currentPageSemester.year &&
      semester.season === currentPageSemester.season,
  );

  if (selectedTabIndex === -1) {
    notFound();
  }

  const rawData = getDataFromFile(
    "campContest",
    currentPageSemester.year,
    currentPageSemester.season,
  );
  const campContestData = renderCampContestData(rawData);

  const currentSeason =
    currentPageSemester.season === "Winter" ? "겨울" : "여름";
  const pageTitle = `${currentPageSemester.year} ${currentPageSemester.season} Camp Contest`;
  const pageSubTitle = `${currentPageSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프 콘테스트`;

  // TODO: note를 적당히 렌더링하기
  if (campContestData.contest.length === 0) {
    return (
      <div>
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
          <Title>콘테스트 일자</Title>
          <Text>{campContestData.dateTime}</Text>
          <Title>캠프 콘테스트 소개</Title>
          <Text>
            캠프 콘테스트는 캠프 기간동안 배운 알고리즘을 적용해볼 수 있는
            모의고사 형식의 대회입니다. 개인전으로 진행되며, ICPC Sinchon
            Algorithm Camp 참가자만 참여할 수 있습니다.
          </Text>
          <Title>출제 경향</Title>
          <Text>
            ICPC Sinchon Algorithm Camp을 통해 학습한 대부분의 알고리즘을 문제로
            다루는 것을 목표로 합니다.
          </Text>
        </HistoryLayout>
      </div>
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
            ? `/res/${currentPageSemester.year}${
                currentPageSemester.season === "Winter" ? "w" : "s"
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
    <div>
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
        <Title>콘테스트 일자</Title>
        <Text>{campContestData.dateTime}</Text>
        <Title>캠프 콘테스트 소개</Title>
        <Text>
          캠프 콘테스트는 캠프 기간동안 배운 알고리즘을 적용해볼 수 있는
          모의고사 형식의 대회입니다. 개인전으로 진행되며, ICPC Sinchon
          Algorithm Camp 참가자만 참여할 수 있습니다.
        </Text>
        <Title>출제 경향</Title>
        <Text>
          ICPC Sinchon Algorithm Camp을 통해 학습한 대부분의 알고리즘을 문제로
          다루는 것을 목표로 합니다.
        </Text>
        {campContestData.contest.map((contest) => (
          <>
            <Title key={contest.contestName} badge={contest.level}>
              {contest.contestName} 수상자
            </Title>
            <DataTable
              key={contest.contestName}
              data={contest.awards}
              columns={[
                { header: "순위", key: "rank" },
                { header: "이름", key: "name" },
                { header: "BOJ 핸들", key: "bojHandle" },
                { header: "소속", key: "school" },
              ]}
            />
            {contest.problemPicker && (
              <>
                <Title badge={contest.level}>
                  {contest.contestName} 문제 선정자
                </Title>
                <DataTable
                  data={contest.problemPicker}
                  columns={[
                    { header: "이름", key: "name" },
                    { header: "BOJ 핸들", key: "bojHandle" },
                    { header: "소속", key: "school" },
                  ]}
                />
              </>
            )}
            {contest.problemList && (
              <>
                <Title badge={contest.level}>
                  {contest.contestName} 문제 리스트
                </Title>
                <DataTable
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
              </>
            )}
          </>
        ))}
      </HistoryLayout>
    </div>
  );
}

export default CampContestPage;

export async function generateStaticParams() {
  const allSemesters = getAllSemesterRouters();
  return allSemesters.map((semester) => ({
    params: { semester: `${semester.year}-${semester.season}` },
  }));
}
