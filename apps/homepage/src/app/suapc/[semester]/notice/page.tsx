import HistoryLayout from "@components/HistoryLayout";
import ContestLinks from "@ui/ContestLinks";
import ListSection from "@ui/ListSection";
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

        <TextSection
          title="안내"
          text="대회 참가 전 반드시 확인해주세요."
        />

        <TextSection
          title="핵심 안내"
          text={
            `본 페이지는 SUAPC ${currentPageSemester.year} ${currentPageSemester.season} 참가팀 대상 유의사항입니다. 아래 항목을 확인하지 않아 발생한 불이익은 운영진이 책임지지 않습니다.`
          }
        />

        <ListSection
          title="1. 팀 계정 및 비밀번호"
          items={[
            "대회는 팀 계정으로만 참여 가능합니다.",
            "계정 정보 유출 시 불이익이 발생할 수 있으니 각별히 주의해 주세요.",
          ]}
        />

        <ListSection
          title="2. 일정 및 장소"
          items={[
            "대회 일시: 2/20 (금) 13:00 ~ 18:00",
            "장소: 구글 스타트업 캠퍼스 B1 (서울 강남구 영동대로 417)",
            "참가팀: 총 22팀",
            "입실: 원활한 진행을 위해 12:45까지 입실해 주세요.",
            "타임테이블: 13:00~18:00 대회 / 18:00~18:30 AiderX 기업 세션 / 18:30~20:00 문제 해설, 스코어보드 공개 및 수상자 발표",
          ]}
        />

        <ListSection
          title="3. 대회 진행 방식"
          items={[
            "팀별 노트북 1대로만 문제를 풀이합니다. (노트북, 충전기 지참)",
            "대회 중 중도퇴실은 불가능합니다.",
            "화장실 이용 시 스태프 동행이 필요하며, 한 번에 1명씩만 이용 가능합니다.",
          ]}
        />

        <ListSection
          title="4. 유의사항"
          items={[
            "(1) 인터넷 검색 금지 / 팀노트 허용",
            "대회 중 인터넷 검색은 불가합니다.",
            "팀노트는 허용되며 A4 단면 25장(표지 제외)까지 가능합니다.",
            "(2) 생성형 AI 사용 금지",
            "ChatGPT를 포함한 생성형 AI 사용이 금지됩니다.",
            "적발 시 본상/특별상을 포함한 모든 수상에서 제외되며, 이후 SUAPC 참여가 제한될 수 있습니다.",
            "(3) 수상 및 상품 안내",
            "총 상금 174만원, 1등~10등 수상팀에 상금이 지급됩니다.",
            "비공식 참여자가 있는 팀은 상금을 받을 수 없습니다.",
            "각 학교 1등 팀(10위 밖)에게 학교 특별상이 수여됩니다.",
            "수상팀 및 특별상 수상팀에게 후원 도서가 제공되며, 참가자 전원에게 SUAPC 기념품이 제공됩니다.",
            "한 문제 이상 해결 시 solved.ac 배경과 뱃지가 제공됩니다.",
            "(4) 금지사항 및 제재",
            "타 팀 참가자와의 소통/코드 공유(본인 팀 제외), 문제/풀이 정보 외부 공유 또는 제공받는 행위는 금지됩니다.",
            "위반 시 본상/특별상을 포함한 모든 수상이 무효 처리되며, 향후 SUAPC 참가가 제한될 수 있습니다.",
          ]}
        />

        <ListSection
          title="5. 실시간 스트리밍 안내"
          items={[
            "대회 현장은 Open Contest와 동시 진행되어 실시간 스트리밍으로 송출될 예정입니다.",
            "대회 화면/음성/진행 상황의 개별 재송출(개인 방송/화면 공유 등)은 금지됩니다.",
          ]}
        />

        <ListSection
          title="문의"
          items={[
            "카카오톡 채널: https://pf.kakao.com/_xehxhAK",
          ]}
        />
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
