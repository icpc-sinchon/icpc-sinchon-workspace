import HistoryLayout from "@components/HistoryLayout";
import ContestLinks from "@ui/ContestLinks";
import TabNav from "@ui/TabNav";
import TextSection from "@ui/TextSection";
import { notFound } from "next/navigation";
import type { Semester } from "src/types";
import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getSemesterFromString } from "src/utils/getSemesterFromString";
import { makePageData } from "src/utils/makePageData";
import { formatLinkURL } from "src/utils/formatLinkURL";

const NOTICE_START_YEAR = 2026;

function SUAPCNoticePage({
  params,
}: {
  params: { semester: string };
}) {
  const currentPageSemester = getSemesterFromString(params.semester);
  const {
    allDataRouters,
    selectedTabIndex,
    renderedPageData: suapcData,
  } = makePageData(currentPageSemester, "suapc");

  const isTargetSemester = currentPageSemester.year >= NOTICE_START_YEAR;
  const currentSeason =
    currentPageSemester.season === "Winter" ? "겨울" : "여름";

  if (!isTargetSemester) {
    notFound();
  }

  const links = suapcData.links ?? {};
  const contestLinks = [
    {
      title: "문제(BOJ 링크)",
      href: formatLinkURL(links.problemBojLink, currentPageSemester),
    },
    {
      title: "문제 PDF",
      href: formatLinkURL(links.problemPdf, currentPageSemester),
    },
    {
      title: "해설 PDF",
      href: formatLinkURL(links.solutionPdf, currentPageSemester),
    },
    {
      title: "스코어보드",
      href: formatLinkURL(links.scoreboard?.[0], currentPageSemester),
    },
    {
      title: "공식 포스터",
      href: formatLinkURL(links.posterImage, currentPageSemester),
    },
    {
      title: "대회 유의사항",
      href: `/suapc/${currentPageSemester.year}-${currentPageSemester.season}/notice`,
    },
  ];

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
      <HistoryLayout
        title={`SUAPC ${currentPageSemester.year} ${currentPageSemester.season}`}
        subTitle={`${currentPageSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 대회`}
      >
        <ContestLinks links={contestLinks} />
        <TextSection title="안내" text="대회 참가 전 반드시 확인해주세요." />
      </HistoryLayout>
    </>
  );
}

export default SUAPCNoticePage;

export async function generateStaticParams() {
  const allSemesters = getAllSemesterRouters();
  return allSemesters
    .filter((semester) => semester.year >= NOTICE_START_YEAR)
    .map((semester) => ({
      semester: `${semester.year}-${semester.season}`,
    }));
}
