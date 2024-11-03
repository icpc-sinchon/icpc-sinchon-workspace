import type { HallOfFame } from "src/types/hallOfFame";

function renderContributor(data: HallOfFame["campContributor"][0]) {
  const formattedData = {
    level: data.level,
    lecturer: data.lecturer.map((lecturer) => ({
      ...lecturer,
      bojHandle: (
        <a
          href={`https://www.acmicpc.net/user/${lecturer.bojHandle}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "black" }}
        >
          {lecturer.bojHandle}
        </a>
      ),
    })),
    ...(data.mentor && {
      mentor: data.mentor.map((mentor) => ({
        ...mentor,
        bojHandle: (
          <a
            href={`https://www.acmicpc.net/user/${mentor.bojHandle}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "black" }}
          >
            {mentor.bojHandle}
          </a>
        ),
      })),
    }),
  };

  return formattedData;
}

export const renderHallOfFameData = (data: HallOfFame) => {
  const formattedData = {
    ...data,
    campContributor: data.campContributor.map((camp) =>
      renderContributor(camp),
    ),
  };
  return formattedData;
};
