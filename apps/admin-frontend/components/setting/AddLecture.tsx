import React, { useState } from "react";

import { Flex, Text } from "@radix-ui/themes";
import { SettingTab } from "@/components/setting/SettingItem";
import FormInput from "../Input";
import FormSelect from "../Select";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import { useSemester } from "@/contexts/SemesterContext";

type LectureInput = {
  // semesterId는 알아서 현재 학기로 설정되도록
  level: "Novice" | "Intermediate" | "Advanced";
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

  const handleLectureAdd = async () => {
    const lecture = {
      year: currentSemester.year,
      season: currentSemester.season,
      ...newLecture,
    };
    await adminAPI.post(API_URL.LECTURE.BASE, lecture);
  };

  const formattedCurrentSemester = `${currentSemester.year}-${currentSemester.season}`;

  return (
    <SettingTab
      tabTitle="강의 추가"
      onSubmit={handleLectureAdd}
      confirmMessage={`${formattedCurrentSemester} 학기에 ${newLecture.level} 난이도 강의를 추가하시겠습니까?(${newLecture.lectureNumber}회, BOJ 그룹 ID: ${newLecture.bojGroupId})`}
    >
      <Flex direction="column" gap="0.5rem">
        <Text as="label" weight="bold">
          현재 학기 : {formattedCurrentSemester}
        </Text>
        <FormSelect
          label="난이도"
          name="level"
          defaultValue="Novice"
          value={newLecture.level}
          onValueChange={(value) =>
            setNewLecture({
              ...newLecture,
              level: value as "Novice" | "Intermediate" | "Advanced",
            })
          }
          options={[
            { value: "Novice", label: "Novice" },
            { value: "Intermediate", label: "Intermediate" },
            { value: "Advanced", label: "Advanced" },
          ]}
        />
        <FormInput
          label="강의 회차"
          name="lectureNumber"
          value={newLecture.lectureNumber.toString()}
          onChange={(e) =>
            setNewLecture({
              ...newLecture,
              lectureNumber: parseInt(e.target.value, 10),
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
              bojGroupId: parseInt(e.target.value, 10),
            })
          }
          type="number"
          min={0}
        />
      </Flex>
    </SettingTab>
  );
}

export default AddLecture;
