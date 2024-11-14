import HistoryLayout from "@components/HistoryLayout";
import ContestLinks from "@ui/ContestLinks";
import LogoSection from "@ui/LogoSection";
import TableSection from "@ui/TableSection";
import TabNav from "@ui/TabNav";
import TextSection from "@ui/TextSection";
import React from "react";
import type { Semester } from "src/types";
import * as styles from "./styles.css";
import { getCurrentSemester } from "src/utils/getCurrentSemester";
import { makePageData } from "src/utils/makePageData";

const suapcDescription = `SUAPC는 신촌지역 5개 대학(서강, 숙명, 연세, 이화, 홍익)의
 학부생 및 대학원 1년차를 대상으로 하는 프로그래밍 대회입니다. 
 대회 문제는 서울 리저널의 문제 출제 경향을 따르며 제한시간 동안 
 얼마나 많은 문제를 정확하게 풀 수 있는지를 평가하여 순위를 결정합니다.`;

const participantDescription = `서강대학교, 숙명여자대학교, 연세대학교, 이화여자대학교, 홍익대학교의 재학/휴학생인 경우
누구나 참여가능합니다. (단, 졸업 1년 차와 대학원생은 참여 가능하되, 대회 중 스코어보드에는 보여지지 않습니다.)
`;

function SUAPCPage() {
  const currentSemester = getCurrentSemester();
  const {
    allDataRouters,
    selectedTabIndex,
    renderedPageData: suapcData,
  } = makePageData(currentSemester, "suapc");

  const currentSeason = currentSemester.season === "Winter" ? "겨울" : "여름";
  const pageTitle = `SUAPC ${currentSemester.year} ${currentSemester.season}`;
  const pageSubTitle = `${currentSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 대회`;

  const contestLinks = suapcData.links
    ? [
        {
          title: "문제(BOJ 링크)",
          href: suapcData.links.problemBojLink ?? "",
        },
        {
          title: "문제 PDF",
          href: suapcData.links.problemPdf
            ? `/res/${currentSemester.year}${
                currentSemester.season === "Winter" ? "w" : "s"
              }/${suapcData.links.problemPdf}`
            : "",
        },
        {
          title: "해설 PDF",
          href: suapcData.links.solutionPdf
            ? `/res/${currentSemester.year}${
                currentSemester.season === "Winter" ? "w" : "s"
              }/${suapcData.links.solutionPdf}`
            : "",
        },
        {
          title: "스코어보드",
          href: suapcData.links.scoreboard?.[0] ?? "",
        },
        {
          title: "공식 포스터",
          href: suapcData.links.posterImage
            ? `/res/${currentSemester.year}${
                currentSemester.season === "Winter" ? "w" : "s"
              }/${suapcData.links.posterImage}`
            : "",
        },
      ]
    : [];

  return (
    <>
      <TabNav
        tabList={allDataRouters}
        currentTabIndex={selectedTabIndex}
        makeTabURL={(semester: Semester) =>
          `/suapc/${semester.year}-${semester.season}`
        }
        makeTabTitle={(semester: Semester) =>
          `${semester.year} ${semester.season}`
        }
      />
      <HistoryLayout title={pageTitle} subTitle={pageSubTitle}>
        {suapcData.links && <ContestLinks links={contestLinks} />}
        <TextSection title="대회 일자" text={suapcData.dateTime} />
        <TextSection title="대회 소개" text={suapcDescription} />
        <TextSection title="참가 대상" text={participantDescription} />
        <LogoSection
          title="후원사"
          logoSources={suapcData.sponsor.map(
            (sponsor) => `/res/sponsor-ci/${sponsor.id}.png`,
          )}
        />
        {suapcData.personalSponsor && (
          <TextSection
            title="개인 후원"
            text={suapcData.personalSponsor
              .map((sponsor) => sponsor.name)
              .join(", ")}
          />
        )}
        {suapcData.contest?.map((contest) => (
          <React.Fragment key={contest.contestName}>
            <TableSection
              key={contest.contestName}
              title="수상 내역"
              titleBadge={contest.contestName}
              data={contest.awards.map((award) => ({
                ...award,
                member: award.member.join(", "),
              }))}
              columns={[
                { key: "rank", header: "순위" },
                { key: "solved", header: "솔브 수" },
                { key: "teamName", header: "팀명" },
                { key: "member", header: "팀원" },
                { key: "school", header: "소속" },
              ]}
            />
            <TableSection
              title="문제 목록"
              titleBadge={contest.contestName}
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
          </React.Fragment>
        ))}
        <section className={styles.tableContainer}>
          <TableSection
            title="출제진"
            data={suapcData.setter}
            columns={[
              { key: "name", header: "이름" },
              { key: "bojHandle", header: "BOJ 핸들" },
              { key: "school", header: "소속" },
            ]}
          />
          <TableSection
            title="검수진"
            data={suapcData.reviewer}
            columns={[
              { key: "name", header: "이름" },
              { key: "bojHandle", header: "BOJ 핸들" },
              { key: "school", header: "소속" },
            ]}
          />
        </section>
      </HistoryLayout>
    </>
  );
}

export default SUAPCPage;
