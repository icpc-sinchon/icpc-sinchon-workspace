import type { Semester } from "src/types";

export function formatLinkURL(
  url: string | undefined,
  semester: Semester,
): string {
  if (!url) {
    return "";
  }
  if (!url.startsWith("http")) {
    return `/res/${semester.year}${
      semester.season === "Winter" ? "w" : "s"
    }/${url}`;
  }
  return url;
}
