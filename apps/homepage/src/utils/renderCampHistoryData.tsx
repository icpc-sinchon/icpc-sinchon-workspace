import type { CampHistory } from "src/types/campHistory";

export const renderCampHistoryData = (data: CampHistory) => {
  const renderData = {
    ...data,
    study: data.study.map((s) => ({
      ...s,
      lecturer: s.lecturer.map((lecturer) => ({
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
      mentor: s.mentor?.map((mentor) => ({
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
    })),
  };
  return renderData;
};
