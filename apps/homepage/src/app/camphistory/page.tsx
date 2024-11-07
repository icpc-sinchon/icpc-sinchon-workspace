import HistoryLayout from "@components/HistoryLayout";
import DataTable from "@components/Table";
import Text from "@components/Text";
import Title from "@components/Title";
import TabNav from "@ui/TabNav";
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

  const noviceCampData = campHistoryData.study.find(
    (data) => data.level === "초급",
  );

  const intermediateCampData = campHistoryData.study.find(
    (data) => data.level === "중급",
  );
  const advancedCampData = campHistoryData.study.find(
    (data) => data.level === "고급",
  );

  return (
    <div>
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
        <Title>알고리즘 캠프 소개</Title>
        <Text>
          ICPC Sinchon에서는 매 시즌 참가자들의 개인적인 성장을 위해 알고리즘
          캠프를 개최하고 있습니다. 각 시즌의 알고리즘 캠프에 기여해 주신 분들과
          커리큘럼을 기록합니다.
        </Text>
        {noviceCampData?.lecturer && (
          <>
            <Title badge="초급">캠프 강사</Title>
            <DataTable
              data={noviceCampData.lecturer}
              columns={[
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ" },
                { key: "school", header: "학교" },
              ]}
              fixedLayout
            />
          </>
        )}
        {noviceCampData?.mentor && (
          <>
            <Title badge="초급">캠프 멘토</Title>
            <DataTable
              data={noviceCampData.mentor}
              columns={[
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ" },
                { key: "school", header: "학교" },
              ]}
              fixedLayout
            />
          </>
        )}
        {noviceCampData?.curriculum && (
          <>
            <Title badge="초급">캠프 커리큘럼</Title>
            <DataTable
              data={noviceCampData.curriculum.map((curriculum, index) => ({
                session: `${index + 1}회차`,
                content: curriculum,
              }))}
              columns={[
                { key: "session", header: "회차" },
                { key: "content", header: "강의 주제" },
              ]}
            />
          </>
        )}
        {intermediateCampData?.lecturer && (
          <>
            <Title badge="중급">캠프 강사</Title>
            <DataTable
              data={intermediateCampData.lecturer}
              columns={[
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ" },
                { key: "school", header: "학교" },
              ]}
              fixedLayout
            />
          </>
        )}
        {intermediateCampData?.mentor && (
          <>
            <Title badge="중급">캠프 멘토</Title>
            <DataTable
              data={intermediateCampData.mentor}
              columns={[
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ" },
                { key: "school", header: "학교" },
              ]}
              fixedLayout
            />
          </>
        )}
        {intermediateCampData?.curriculum && (
          <>
            <Title badge="중급">캠프 커리큘럼</Title>
            <DataTable
              data={intermediateCampData.curriculum.map(
                (curriculum, index) => ({
                  session: `${index + 1}회차`,
                  content: curriculum,
                }),
              )}
              columns={[
                { key: "session", header: "회차" },
                { key: "content", header: "강의 주제" },
              ]}
            />
          </>
        )}
        {advancedCampData?.lecturer && (
          <>
            <Title badge="고급">캠프 강사</Title>
            <DataTable
              data={advancedCampData.lecturer}
              columns={[
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ" },
                { key: "school", header: "학교" },
              ]}
            />
          </>
        )}
        {advancedCampData?.mentor && (
          <>
            <Title badge="고급">캠프 멘토</Title>
            <DataTable
              data={advancedCampData.mentor}
              columns={[
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ" },
                { key: "school", header: "학교" },
              ]}
              fixedLayout
            />
          </>
        )}
        {advancedCampData?.curriculum && (
          <>
            <Title badge="고급">캠프 커리큘럼</Title>
            <DataTable
              data={advancedCampData.curriculum.map((curriculum, index) => ({
                session: `${index + 1}회차`,
                content: curriculum,
              }))}
              columns={[
                { key: "session", header: "회차" },
                { key: "content", header: "강의 주제" },
              ]}
            />
          </>
        )}
      </HistoryLayout>
    </div>
  );
}

export default CampHistoryPage;
