import {
  Heading,
  Button,
  Flex,
  Separator,
  Card,
  Text,
  Select,
} from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import type { Level, Season } from "@/types/models";
import { useSemester } from "@/contexts/SemesterContext";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import type { Lecture, Semester } from "@/types/setting";
import Toast from "@/components/Toast";
import { COLORS } from "@/styles/colors";

type AttendPageControlProps = {
  lectureLevelOptions: Level[];
  selectedLectureIndex: number;
  onLectureChange: (value: string) => void;
  tasks: Lecture["task"];
  onSaveChanges: () => void;
};

function AttendPageControlPanel({
  lectureLevelOptions,
  selectedLectureIndex,
  onLectureChange,
  tasks,
  onSaveChanges,
}: AttendPageControlProps) {
  const router = useRouter();
  const { currentSemester } = useSemester();

  const [toast, setToast] = useState({
    show: false,
    text: "",
    color: COLORS.primarySurface,
  });

  const level = lectureLevelOptions[selectedLectureIndex];

  const onCrawlAttendance = useCallback(
    async (taskId: number, round: number) => {
      try {
        const res = await adminAPI.post(API_URL.BOJ.ATTENDANCE, {
          taskId,
        });
        if (res.data.length === 0) {
          setToast({
            show: true,
            text: `해당 강의의 ${round}회차에 과제를 한 학생이 없습니다. BOJ 로그인하셨나요?`,
            color: COLORS.errorText,
          });
          return;
        }

        setToast({
          show: true,
          text: `${level} 강의의 ${round}회차 과제 출석 데이터를 크롤링했습니다.`,
          color: COLORS.primarySurface,
        });
      } catch (err) {
        console.error("Failed to crawl attendance:", err);
        setToast({
          show: true,
          text: "출석 데이터 크롤링에 실패했습니다.",
          color: COLORS.errorText,
        });
      }
    },
    [level],
  );

  return (
    <>
      <Toast
        text={toast.text}
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        color={toast.color}
      />
      <Card my="2">
        <Flex direction="row" gap="4" justify="start" align="center" pb="2">
          <Heading as="h2" size="4">
            현재 시즌 : {currentSemester.year} {currentSemester.season}
          </Heading>
          <Button
            size="2"
            onClick={() => router.push("/setting/change-semester")}
          >
            시즌 변경
          </Button>
          <Separator size="2" orientation="vertical" />
          <Flex gap="2" direction="row" align="center">
            <Heading as="h2" size="4">
              난이도 변경
            </Heading>
            <Select.Root value={level} onValueChange={onLectureChange} size="2">
              <Select.Trigger />
              <Select.Content>
                {lectureLevelOptions.map((option) => (
                  <Select.Item key={option} value={option}>
                    {option}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
        <Separator mb="2" size="4" />
        <Flex gap="2" direction="column" overflowX="auto">
          <Flex direction="row" justify="start" gap="4">
            <Button
              size="2"
              onClick={() => router.push("/setting/refund-policy")}
            >
              환급조건 설정 페이지
            </Button>
            <Button
              size="2"
              onClick={() => router.push("/setting/change-lecture")}
            >
              과제 설정 페이지
            </Button>
          </Flex>

          <Heading as="h3" size="4">
            출석 데이터 크롤링
          </Heading>
          <Flex direction="row" gap="2">
            {tasks.map((t) => (
              <Button
                size="2"
                key={t.id}
                color="cyan"
                onClick={() => onCrawlAttendance(t.id, t.round)}
              >
                {t.round}회차
              </Button>
            ))}
          </Flex>
          <Button size="3" onClick={onSaveChanges} color="violet">
            변경사항 저장
          </Button>
        </Flex>
      </Card>
    </>
  );
}

export default AttendPageControlPanel;
