import React, { useEffect, useState } from "react";

import { Flex, Heading, Separator, Text } from "@radix-ui/themes";
import { SettingTab } from "@/components/setting/SettingItem";
import FormInput from "../Input";
import FormSelect from "../Select";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import { useSemester } from "@/contexts/SemesterContext";
import { Level } from "@/types/models";
import { Lecture } from "@/types/setting";

type LectureInput = {
  // semesterId는 알아서 현재 학기로 설정되도록
  level: Level;
  lectureNumber: number;
  bojGroupId: number;
};

function AddLecture() {
  const { currentSemester } = useSemester();
  const [newLecture, setNewLecture] = useState<LectureInput>({
    level: "Novice",
    lectureNumber: 10,
    bojGroupId: 10000,
  });
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const handleLectureAdd = async () => {
    const lecture = {
      semesterId: currentSemester.id,
      ...newLecture,
    };
    await adminAPI.post(API_URL.LECTURE.BASE, lecture);
  };

  const formattedCurrentSemester = `${currentSemester.year}-${currentSemester.season}`;

  useEffect(() => {
    adminAPI
      .get<Lecture[]>(API_URL.LECTURE.BASE, {
        params: {
          year: currentSemester.year,
          season: currentSemester.season,
        },
      })
      .then((res) => {
        console.log(res.data);
        setLectures(res.data);
      });
  }, [currentSemester]);

  return (
    <SettingTab
      tabTitle="강의 추가"
      onSubmit={handleLectureAdd}
      confirmMessage={`${formattedCurrentSemester} 학기에 ${newLecture.level} 난이도 강의를 추가하시겠습니까?(${newLecture.lectureNumber}회, BOJ 그룹 ID: ${newLecture.bojGroupId})`}
    >
      <Flex direction="column" gap="0.5rem">
        <Text as="label" weight="bold" size="5">
          현재 학기 : {formattedCurrentSemester}
        </Text>
        <Separator orientation="horizontal" size="4" />
        <Heading as="h3" size="5">
          기존 강의 목록(중복 생성 시 오류 발생)
        </Heading>
        {lectures.map((lecture) => (
          <Text key={lecture.id}>
            {lecture.level} ({lecture.lectureNumber}회차)
          </Text>
        ))}
        <Separator orientation="horizontal" size="4" />
        <FormSelect
          label="난이도"
          name="level"
          defaultValue="Novice"
          value={newLecture.level}
          onValueChange={(value) =>
            setNewLecture({
              ...newLecture,
              level: value as Level,
            })
          }
          options={[
            { value: "Novice", label: "Novice" },
            { value: "Advanced", label: "Advanced" },
            { value: "Expert", label: "Expert" },
          ]}
        />
        <FormInput
          label="강의 회차"
          name="lectureNumber"
          value={newLecture.lectureNumber.toString()}
          onChange={(e) =>
            setNewLecture({
              ...newLecture,
              lectureNumber: Number.parseInt(e.target.value, 10),
            })
          }
          type="number"
          max={20}
          min={1}
        />
        <FormInput
          label="BOJ 그룹 ID"
          name="bojGroupId"
          value={newLecture.bojGroupId.toString()}
          onChange={(e) =>
            setNewLecture({
              ...newLecture,
              bojGroupId: Number.parseInt(e.target.value, 10),
            })
          }
          type="number"
          min={0}
          helperText="그룹 주소의 숫자 부분. 예를 들어 강의에 쓰이는 BOJ 주소가 https://www.acmicpc.net/group/21486 이라면 21486을 입력하세요."
        />
      </Flex>
    </SettingTab>
  );
}

export default AddLecture;
