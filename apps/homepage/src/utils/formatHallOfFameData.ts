import type { HallOfFame } from "src/types/hallOfFame";

export const formatHallOfFameData = (data: HallOfFame) => {
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
