import HistoryLayout from "@components/HistoryLayout";
import DataTable from "@components/Table";
import Text from "@components/Text";
import Title from "@components/Title";
import TabNav from "@ui/TabNav";
import type { Semester } from "src/types";
import { renderHallOfFameData } from "src/utils/renderHallOfFameData";
import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getCurrentSemester } from "src/utils/getCurrentSemester";
import { getDataFromFile } from "src/utils/getDataFromFile";

function HallOfFamePage() {
  const currentSemester = getCurrentSemester();
  const rawData = getDataFromFile(
    "hallOfFame",
    currentSemester.year,
    currentSemester.season,
  );
  const hallOfFameData = renderHallOfFameData(rawData);
  const allDataRouters = getAllSemesterRouters("hallOfFame");
  const selectedTabIndex = allDataRouters.findIndex(
    (semester) =>
      semester.year === currentSemester.year &&
      semester.season === currentSemester.season,
  );

  const currentSeason = currentSemester.season === "Winter" ? "겨울" : "여름";

  const pageTitle = `${currentSemester.year} ${currentSemester.season} HALL OF FAME`;
  const pageSubTitle = `${currentSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 명예의 전당`;

  const noviceCampData = hallOfFameData.campContributor.find(
    (data) => data.level === "초급",
  );

  const intermediateCampData = hallOfFameData.campContributor.find(
    (data) => data.level === "중급",
  );
  const advancedCampData = hallOfFameData.campContributor.find(
    (data) => data.level === "고급",
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
      <HistoryLayout title={pageTitle} subTitle={pageSubTitle}>
        <Title>명예의 전당 소개</Title>
        <Text>
          ICPC Sinchon에서 SUAPC, Algorithm Camp의 운영을 맡아 주신 운영진
          분들과 Algorithm Camp에서 강의와 알고리즘 캠프 멘토 활동으로
          기여해주신 분들을 기립니다.
        </Text>
        {/* TODO: 각 섹션 간 간격 조절 */}
        {hallOfFameData.president && (
          <>
            <Title>회장</Title>
            <DataTable
              data={hallOfFameData.president}
              columns={[
                { key: "role", header: "직책" },
                { key: "name", header: "이름" },
                { key: "school", header: "학교" },
              ]}
              fixedLayout
            />
          </>
        )}
        <Title>운영진</Title>
        <DataTable
          data={hallOfFameData.manager}
          columns={[
            { key: "role", header: "직책" },
            { key: "name", header: "이름" },
            { key: "school", header: "학교" },
          ]}
          fixedLayout
        />
        {hallOfFameData.contributor && (
          <>
            <Title>기타 기여자</Title>
            <DataTable
              data={hallOfFameData.contributor}
              columns={[
                { key: "role", header: "직책" },
                { key: "name", header: "이름" },
                { key: "school", header: "학교" },
              ]}
              fixedLayout
            />
          </>
        )}
        {noviceCampData.lecturer && (
          <>
            <Title badge="초급">알고리즘 캠프 강사</Title>
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
        {noviceCampData.mentor && (
          <>
            <Title badge="초급">알고리즘 캠프 멘토</Title>
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
        {intermediateCampData.lecturer && (
          <>
            <Title badge="중급">알고리즘 캠프 강사</Title>
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
            <Title badge="중급">알고리즘 캠프 멘토</Title>
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
        {advancedCampData?.lecturer && (
          <>
            <Title badge="고급">알고리즘 캠프 강사</Title>
            <DataTable
              data={advancedCampData.lecturer}
              columns={[
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ" },
                { key: "school", header: "학교" },
              ]}
              fixedLayout
            />
          </>
        )}
        {advancedCampData?.mentor && (
          <>
            <Title badge="고급">알고리즘 캠프 멘토</Title>
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
      </HistoryLayout>
    </div>
  );
}

export default HallOfFamePage;
