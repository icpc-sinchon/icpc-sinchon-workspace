import React, { useEffect, useState } from "react";

import { Flex, Heading, Separator, Text } from "@radix-ui/themes";
import { SettingTab } from "@/components/setting/SettingItem";
import FormInput from "../Input";
import FormSelect from "../Select";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import { Semester } from "@/types/setting";

type SemesterInput = {
  year: number;
  season: "Summer" | "Winter";
};

function AddSemester() {
  const [newSemester, setNewSemester] = useState<SemesterInput>({
    year: 2024,
    season: "Summer",
  });
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    adminAPI.get(API_URL.SEMESTER.BASE).then((res) => {
      setSemesters(res.data);
    });
  }, []);

  const handleSemesterAdd = async () => {
    await adminAPI.post(API_URL.SEMESTER.BASE, newSemester);
  };

  return (
    <SettingTab
      tabTitle="학기 추가"
      onSubmit={handleSemesterAdd}
      confirmMessage={`${newSemester.year}-${newSemester.season} 학기를 추가하시겠습니까?`}
    >
      <Heading as="h3" size="5">
        기존 학기 목록(중복 생성 시 오류 발생)
      </Heading>
      {semesters.map((semester) => (
        <Text key={semester.id}>
          {semester.year} {semester.season}
        </Text>
      ))}
      <Separator orientation="horizontal" size="4" />
      <Flex direction="row" gap="0.5rem" align="stretch">
        <FormInput
          label="연도"
          name="year"
          placeholder="2024"
          type="number"
          min={2000}
          max={9999}
          value={newSemester.year.toString()}
          onChange={(e) =>
            setNewSemester({
              ...newSemester,
              year: Number.parseInt(e.target.value, 10),
            })
          }
        />
        <FormSelect
          label="시즌"
          name="season"
          defaultValue="Summer"
          value={newSemester.season}
          onValueChange={(value) =>
            setNewSemester({
              ...newSemester,
              season: value as "Summer" | "Winter",
            })
          }
          options={[
            { value: "Summer", label: "Summer" },
            { value: "Winter", label: "Winter" },
          ]}
        />
      </Flex>
    </SettingTab>
  );
}

export default AddSemester;
