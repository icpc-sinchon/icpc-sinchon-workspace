import HistoryLayout from "@components/HistoryLayout";

import TabNav from "@ui/TabNav";
import fs from "node:fs";
import path from "node:path";
import type { Semester } from "src/types";
import { formatFilenames } from "src/utils/formatFilenames";
import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getDataFromFile } from "src/utils/getDataFromFile";
import { getSemesterFromString } from "src/utils/getSemesterFromString";
import Text from "@components/Text";
import Title from "@components/Title";
import DataTable from "@components/Table";
import type { HallOfFame } from "src/types/hallOfFame";

const formatHallOfFameData = (data: HallOfFame) => {
  const formattedData = {
    ...data,
    campContributor: data.campContributor.map((camp) => ({
      level: camp.level,
      lecturer: camp.lecturer.map((lecturer) => ({
        ...lecturer,
        bojHandle: {
          label: lecturer.bojHandle,
          url: `https://www.acmicpc.net/user/${lecturer.bojHandle}`,
        },
      })),
      mentor: (camp.mentor ?? []).map((mentor) => ({
        ...mentor,
        bojHandle: {
          label: mentor.bojHandle,
          url: `https://www.acmicpc.net/user/${mentor.bojHandle}`,
        },
      })),
    })),
  };
  return formattedData;
};

// TODO: [semester]에 없는 내용이면 getSemesterFromString 함수가 작동 안하게 하기
async function HallOfFamePage({
  params,
}: {
  params: { semester: string };
}) {
  const { semester } = params;
  const currentPageSemester = getSemesterFromString(semester);
  const rawData = getDataFromFile(
    "hallOfFame",
    currentPageSemester.year,
    currentPageSemester.season,
  );
  // TODO: JSON 스키마에서 타입 가져오기
  const hallOfFameData = formatHallOfFameData(rawData);
  const allDataRouters = getAllSemesterRouters("hallOfFame");
  const selectedTabIndex = allDataRouters.findIndex(
    (semester) =>
      semester.year === currentPageSemester.year &&
      semester.season === currentPageSemester.season,
  );

  const currentSeason =
    currentPageSemester.season === "Winter" ? "겨울" : "여름";

  const pageTitle = `${currentPageSemester.year} ${currentPageSemester.season} HALL OF FAME`;
  const pageSubTitle = `${currentPageSemester.year} ${currentSeason} 신촌지역 대학교 프로그래밍 동아리 연합 명예의 전당`;

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
            />
          </>
        )}
        {intermediateCampData.mentor && (
          <>
            <Title badge="중급">알고리즘 캠프 멘토</Title>
            <DataTable
              data={intermediateCampData.mentor}
              columns={[
                { key: "name", header: "이름" },
                { key: "bojHandle", header: "BOJ" },
                { key: "school", header: "학교" },
              ]}
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
            />
          </>
        )}
      </HistoryLayout>
    </div>
  );
}

export default HallOfFamePage;

export async function generateStaticParams() {
  const hallOfFameDataDirectory = path.join(
    process.cwd(),
    "..",
    "..",
    "libs",
    "data",
    "hallOfFame",
  );
  const filenames = fs.readdirSync(hallOfFameDataDirectory);
  const formattedFilenames = formatFilenames(filenames);
  return formattedFilenames.map((semester) => ({
    params: { semester },
  }));
}
