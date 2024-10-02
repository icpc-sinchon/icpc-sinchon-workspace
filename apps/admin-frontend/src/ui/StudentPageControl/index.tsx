import styled from "styled-components";
import {
  Heading,
  Button,
  Flex,
  Text,
  Select,
  Separator,
  Card,
} from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useCallback } from "react";
import type { Column, TableSortState } from "@/ui/Table/types";
import SearchBox from "../SearchBox";
import AddStudentDialog from "./AddStudentDialog";
import AddMultipleStudentDialog from "./AddMultipleStudentDialog";
import { useSemester } from "@/contexts/SemesterContext";
import type { Student } from "@/types/models";

// TODO: sort 관련한 것들, 검색도 커스텀 훅으로 뺄 수 있을 것 같음
type StudentPageControlProps<T extends Record<string, any>> = {
  sortCriteria: TableSortState<T>;
  sortOptions: Column<T>[];
  searchString: string;
  onSearchStringChange: (newSearchString: string) => void;
  onSortCriteriaChange: (newSortCriteria: TableSortState<T>) => void;
  totalStudents: number;
  selectedStudentsCount: number;
};

function StudentPageControlPanel<T extends Student>({
  sortCriteria,
  sortOptions,
  searchString,
  onSearchStringChange,
  onSortCriteriaChange,
  totalStudents,
  selectedStudentsCount,
}: StudentPageControlProps<T>) {
  // props : currentSeason, sortCriteria, searchString, onSearchStringChange, onSortCriteriaChange
  const router = useRouter();
  const { currentSemester } = useSemester();

  const handleSortOptionChange = useCallback(
    (value: string) => {
      const newSortKey = sortOptions.find(
        (option) => option.accessor.toString() === value,
      ) as Column<T>;
      onSortCriteriaChange({ key: newSortKey, order: sortCriteria.order });
    },
    [sortOptions, sortCriteria.order, onSortCriteriaChange],
  );

  const handleSortOrderChange = useCallback(() => {
    onSortCriteriaChange({
      key: sortCriteria.key,
      order: sortCriteria.order === "asc" ? "desc" : "asc",
    });
  }, [sortCriteria, onSortCriteriaChange]);

  return (
    <Card my="2">
      <Flex direction="row" align="center" gap="4" pb="2">
        <Heading as="h2" size="4">
          현재 시즌 : {currentSemester.year} {currentSemester.season}
        </Heading>
        <Button
          size="2"
          onClick={() => router.push("/setting/change-semester")}
        >
          시즌 변경
        </Button>
      </Flex>
      <Separator mb="2" size="4" />
      <Flex gap="2" direction="column" overflowX="auto">
        <Flex gap="4" direction="row" justify="start">
          <SearchBox
            searchString={searchString}
            onSearchStringChange={onSearchStringChange}
          />
          <Flex gap="2" direction="row" align="center">
            <Text as="p" size="3">
              정렬기준
            </Text>
            <Select.Root
              onValueChange={handleSortOptionChange}
              size="2"
              defaultValue={sortOptions[0].accessor.toString()}
            >
              <Select.Trigger />
              <Select.Content>
                {sortOptions.map((option) => (
                  <Select.Item
                    key={option.accessor.toString()}
                    value={option.accessor.toString()}
                  >
                    {option.header}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Button size="2" onClick={handleSortOrderChange}>
              {sortCriteria.order === "desc" ? (
                <SortIcon src="/icon/ascending.svg" />
              ) : (
                <SortIcon src="/icon/descending.svg" />
              )}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Separator my="2" size="4" />
      <Flex gap="2" direction="row" justify="start" align="center">
        <Flex
          gap="1"
          direction="column"
          justify="center"
          flexShrink="0"
          flexBasis="auto"
        >
          <Heading as="h3" size="4">
            학생 추가
          </Heading>
          <Flex gap="2" direction="row" align="center" flexShrink="0">
            <AddStudentDialog />
            <AddMultipleStudentDialog />
          </Flex>
        </Flex>
        <Separator orientation="vertical" size="3" />
        <Flex gap="1" direction="column" justify="center">
          <Heading as="h3" size="4">
            학생 관리
          </Heading>
          <Text as="p" size="3">
            전체 : {totalStudents}명, 체크된 학생 : {selectedStudentsCount}명
          </Text>
          <Flex gap="2" direction="row" align="center">
            <Text size="2">문자보내기, 그룹초대, 내보내기 등 추가예정</Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default StudentPageControlPanel;

const SortIcon = styled.img`
  width: 1rem;
  height: 1rem;
  color: ${({ theme }) => theme.colors.white};
`;
