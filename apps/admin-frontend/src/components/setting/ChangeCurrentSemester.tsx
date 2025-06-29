import React, { useEffect, useState } from "react";

import { Select } from "@radix-ui/themes";
import { SettingTab } from "@/components/setting/SettingItem";
import type { Semester } from "@/types/setting";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import { useSemester } from "@/contexts/SemesterContext";

function ChangeCurrentSemester() {
  const { currentSemester } = useSemester();
  const [newSemester, setNewSemester] = useState<Semester | null>(
    currentSemester,
  );
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    adminAPI.get<Semester[]>(API_URL.SEMESTER.BASE).then((res) => {
      setSemesters(res.data);
    });
  }, []);

  const handleSemesterChange = (value: string) => {
    const [year, season] = value.split("-");
    const newSemesterItem = semesters.find(
      (semester) =>
        semester.year === Number.parseInt(year, 10) &&
        semester.season === season,
    );
    if (!newSemesterItem) return;
    setNewSemester(newSemesterItem);
  };

  // 진짜 현재 학기를 바꾸는 함수
  const handleSubmit = async () => {
    await adminAPI.post(API_URL.CONFIG, {
      currentSemester: newSemester,
    });
  };

  const formattedCurrentSemester = `${currentSemester.year}-${currentSemester.season}`;
  const formattedNewSemester = `${newSemester.year}-${newSemester.season}`;
  const formattedSemesters = semesters.map(
    (semester) => `${semester.year}-${semester.season}`,
  );

  return (
    <SettingTab
      tabTitle="현재 학기 변경"
      onSubmit={handleSubmit}
      confirmMessage={`시즌을 ${formattedCurrentSemester}에서 ${formattedNewSemester}으로 바꾸시겠습니까?`}
    >
      <Select.Root
        size="3"
        value={formattedNewSemester}
        onValueChange={handleSemesterChange}
        defaultValue={formattedCurrentSemester}
      >
        <Select.Trigger />
        <Select.Content>
          {formattedSemesters.map((semester) => (
            <Select.Item key={semester} value={semester}>
              {semester}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </SettingTab>
  );
}

export default ChangeCurrentSemester;
