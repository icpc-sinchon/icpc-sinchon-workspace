import type { HallOfFame } from "src/types/hallOfFame";

function formatContributor(data: HallOfFame["campContributor"][0]) {
  const formattedData = {
    level: data.level,
    lecturer: data.lecturer.map((lecturer) => ({
      ...lecturer,
      bojHandle: {
        label: lecturer.bojHandle,
        url: `https://www.acmicpc.net/user/${lecturer.bojHandle}`,
      },
    })),
    ...(data.mentor && {
      mentor: data.mentor.map((mentor) => ({
        ...mentor,
        bojHandle: {
          label: mentor.bojHandle,
          url: `https://www.acmicpc.net/user/${mentor.bojHandle}`,
        },
      })),
    }),
  };

  return formattedData;
}

export const formatHallOfFameData = (data: HallOfFame) => {
  const formattedData = {
    ...data,
    campContributor: data.campContributor.map((camp) =>
      formatContributor(camp),
    ),
  };
  return formattedData;
};
