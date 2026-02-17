import HistoryLayout from "@components/HistoryLayout";
import Title from "@components/Title";
import ContestLinks from "@ui/ContestLinks";
import TabNav from "@ui/TabNav";
import TextSection from "@ui/TextSection";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type React from "react";
import * as styles from "./styles.css";
import type { Semester } from "src/types";
import { getAllSemesterRouters } from "src/utils/getAllSemesterRouters";
import { getSemesterFromString } from "src/utils/getSemesterFromString";
import { makePageData } from "src/utils/makePageData";
import { formatLinkURL } from "src/utils/formatLinkURL";
import { renderLink } from "src/utils/renderHelpers";

const NOTICE_START_YEAR = 2026;
const NOTICE_CONTENT_PATH = path.join(
  process.cwd(),
  "src",
  "app",
  "suapc",
  "[semester]",
  "notice",
  "content.md",
);

type NoticeSection = {
  title: string;
  items: NoticeItem[];
};

type NoticeItem = {
  content: React.ReactNode;
  depth: 0 | 1;
  isBullet: boolean;
};

function normalizeMarkdownText(text: string) {
  let normalized = text.replace(/\\~/g, "~").replace(/\u00A0/g, " ");

  // markdown emphasis/code markers
  normalized = normalized.replace(/\*\*(.*?)\*\*/g, "$1");
  normalized = normalized.replace(/`([^`]+)`/g, "$1");

  return normalized.trim();
}

function renderNoticeLine(text: string) {
  const tokenRegex =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)|<(https?:\/\/[^>\s]+)>|(https?:\/\/[^\s<]+)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const trimTrailingPunctuation = (url: string) => {
    let trimmed = url;

    while (true) {
      if (trimmed.length === 0) {
        return trimmed;
      }

      const lastChar = trimmed[trimmed.length - 1];
      if (!".,;:!?)]".includes(lastChar)) {
        return trimmed;
      }

      // Keep balanced parenthesis in URL path/query.
      if (lastChar === ")") {
        const openingCount = (trimmed.match(/\(/g) ?? []).length;
        const closingCount = (trimmed.match(/\)/g) ?? []).length;
        if (closingCount <= openingCount) {
          return trimmed;
        }
      }

      trimmed = trimmed.slice(0, -1);
    }
  };

  while (true) {
    match = tokenRegex.exec(text);
    if (!match) {
      break;
    }

    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    const markdownLabel = match[1];
    const markdownUrl = match[2];
    const bracketedPlainUrl = match[3];
    const plainUrl = match[4];

    if (markdownLabel && markdownUrl) {
      nodes.push(
        renderLink({
          title: markdownLabel.trim(),
          url: markdownUrl.trim(),
        }),
      );
    } else if (bracketedPlainUrl) {
      const cleanUrl = trimTrailingPunctuation(bracketedPlainUrl);
      nodes.push(
        renderLink({
          title: cleanUrl,
          url: cleanUrl,
        }),
      );
    } else if (plainUrl) {
      const cleanUrl = trimTrailingPunctuation(plainUrl);
      nodes.push(
        renderLink({
          title: cleanUrl,
          url: cleanUrl,
        }),
      );
    }

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  if (nodes.length === 0) {
    return text;
  }

  return nodes.map((node, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static parsed content
    <span key={index}>{node}</span>
  ));
}

function parseNoticeSections(markdown: string) {
  const sections: NoticeSection[] = [];
  let currentSection: NoticeSection | null = null;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      continue;
    }

    const headingMatch = trimmed.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      currentSection = {
        title: normalizeMarkdownText(headingMatch[1]),
        items: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      continue;
    }

    const bulletMatch = rawLine.match(/^(\s*)[-*]\s+(.+)$/);
    if (bulletMatch) {
      const leadingWhitespace = bulletMatch[1].replace(/\t/g, "  ");
      const depth =
        Math.floor(leadingWhitespace.length / 2) > 0 ? 1 : 0;
      currentSection.items.push({
        content: renderNoticeLine(normalizeMarkdownText(bulletMatch[2])),
        depth,
        isBullet: true,
      });
      continue;
    }

    currentSection.items.push({
      content: renderNoticeLine(normalizeMarkdownText(trimmed)),
      depth: 0,
      isBullet: false,
    });
  }

  return sections.filter((section) => section.items.length > 0);
}

function getNoticeItemClassName(item: NoticeItem) {
  if (!item.isBullet) {
    return styles.plainItem;
  }

  return item.depth > 0 ? styles.subBulletItem : styles.bulletItem;
}

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
  const noticeMarkdown = fs.readFileSync(NOTICE_CONTENT_PATH, "utf-8");
  const noticeSections = parseNoticeSections(noticeMarkdown);

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
        {noticeSections.map((section) => (
          <section key={section.title} className={styles.section}>
            <Title>{section.title}</Title>
            <ul className={styles.list}>
              {section.items.map((item, index) => (
                <li
                  key={`${section.title}-${index}`}
                  className={getNoticeItemClassName(item)}
                >
                  {item.content}
                </li>
              ))}
            </ul>
          </section>
        ))}
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
