import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import Layout from "@/ui/Layout";
import { TableWrap } from "@/ui/Table/TableStyles";
import searchStringInObject from "@/utils/searchStringInObject";
import type { Column, TableSortState } from "@/ui/Table/types";

import { adminAPI } from "@/utils/api";
import type { Student } from "@/types/models";
import StudentTable from "@/ui/Table/StudentTable";
import { API_URL } from "@/types/apis";
import { useSemester } from "@/contexts/SemesterContext";
import { withAuth } from "@/components/withAuth";
import { COLORS } from "@/styles/colors";
import Toast from "@/components/Toast";
import StudentPageControlPanel from "@/ui/StudentPageControl";

export const studentColumns: Column<Student>[] = [
  { header: "고유번호", accessor: "id", inputType: "none" },
  { header: "이름", accessor: "name", inputType: "text" },
  {
    header: "학교",
    accessor: "school",
    inputType: "select",
    options: [
      {
        value: "YONSEI",
        label: "YONSEI",
      },
      {
        value: "SOGANG",
        label: "SOGANG",
      },
      {
        value: "EWHA",
        label: "EWHA",
      },
      {
        value: "HONGIK",
        label: "HONGIK",
      },
      {
        value: "SOOKMYUNG",
        label: "SOOKMYUNG",
      },
    ],
  },
  { header: "학번", accessor: "studentNumber", inputType: "text" },
  { header: "BOJ 핸들", accessor: "bojHandle", inputType: "text" },
  // { header: "이메일", accessor: "email", inputType: "text" },
  { header: "연락처", accessor: "phone", inputType: "text" },
  {
    header: "환급 유형",
    accessor: "paymentStatus",
    inputType: "select",
    options: [
      { value: "PAID_30000", label: "PAID_30000" },
      { value: "PAID_60000", label: "PAID_60000" },
    ],
  },
  {
    header: "난이도",
    accessor: "lectureLevels",
    inputType: "none",
  },
  {
    header: "환급 계좌",
    accessor: "refundAccount",
    inputType: "text",
  },
];

// 수정 가능한 필드의 accessor만 추출
const editableFields = studentColumns
  .filter((column) => column.inputType !== "none")
  .map((column) => column.accessor);

// edit할 수 있는 필드만 추출
function formatEditStudent(student: Student): Partial<Student> {
  return editableFields.reduce((acc, field) => {
    acc[field] = student[field];
    return acc;
  }, {});
}

function sortStudents(
  students: Student[],
  sortCriteria: TableSortState<Student>,
) {
  return [...students].sort((a, b) => {
    const criteriaAccessor = sortCriteria.key.accessor;
    if (sortCriteria.order === "asc") {
      return a[criteriaAccessor] > b[criteriaAccessor] ? 1 : -1;
    }
    return a[criteriaAccessor] < b[criteriaAccessor] ? 1 : -1;
  });
}

function processStudents(
  students: Student[],
  sortCriteria: TableSortState<Student>,
  searchString: string,
) {
  if (!students) return [];
  const result = searchString
    ? students.filter((student) => searchStringInObject(student, searchString))
    : students;
  return sortStudents(result, sortCriteria);
}

const studentFetcher = ([url, year, season]: [string, number, string]) =>
  adminAPI
    .get<Student[]>(url, {
      params: { year, season },
    })
    .then((res) => res.data);

// TODO: 학생을 Context로 관리하여 props drilling을 줄이기
// 학생 추가한 다음 새로고침해야 반영되는 문제 수정해야 함
// 이후 체크박스를 통해 일괄 편집하는 기능 추가하기
function StudentPage() {
  const { currentSemester } = useSemester();
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(
    new Set(),
  );
  const [searchString, setSearchString] = useState("");
  const [sortCriteria, setSortCriteria] = useState<TableSortState<Student>>({
    key: studentColumns[0],
    order: "asc",
  });
  const [toast, setToast] = useState({
    show: false,
    text: "",
    color: COLORS.primarySurface,
  });

  const {
    data: students,
    error,
    isLoading,
    mutate,
  } = useSWR<Student[]>(
    [API_URL.STUDENT.BASE, currentSemester.year, currentSemester.season],
    studentFetcher,
  );

  if (isLoading || error) return <div>Loading...</div>;

  const processedStudents = processStudents(
    students,
    sortCriteria,
    searchString,
  );

  const handleCheckboxChange = (selectedIds: Set<number>) => {
    setSelectedStudentIds(selectedIds);
  };

  const handleSortCriteriaChange = (
    newSortCriteria: TableSortState<Student>,
  ) => {
    setSortCriteria(newSortCriteria);
  };

  const handleSearchStringChange = (value: string) => {
    setSearchString(value);
  };

  const handleDeleteStudent = async (itemId: number) => {
    try {
      await adminAPI.delete(API_URL.STUDENT.byId(itemId));
      mutate();
      setToast({
        show: true,
        text: "학생 삭제 완료",
        color: COLORS.primarySurface,
      });
    } catch (err) {
      console.error("Failed to delete student:", err);
      setToast({
        show: true,
        text: "학생 삭제 실패",
        color: COLORS.errorText,
      });
    }
  };

  // TODO: 수정하는 형식 맞추기
  const handleEditStudent = async (editedItem: Student) => {
    try {
      // TODO: lectureLevels가 있으면 student에서 수정하도록 수정
      // TODO: 강의 레벨은 select로 수정하도록 하자.
      const studentEditData = formatEditStudent(editedItem);
      await adminAPI.patch(
        API_URL.STUDENT.byId(editedItem.id),
        studentEditData,
      );
      mutate();
      setToast({
        show: true,
        text: "학생 정보 수정 완료",
        color: COLORS.primarySurface,
      });
    } catch (err) {
      console.error("Failed to edit student:", err);
      setToast({
        show: true,
        text: "학생 정보 수정 실패",
        color: COLORS.errorText,
      });
    }
  };

  return (
    <>
      <Head>
        <title>학생 관리 | ICPC Admin</title>
      </Head>
      <Layout
        title="학생 관리"
        description="학생들의 정보를 관리하고 메시지나 메일을 보낼 수 있습니다."
      >
        <Toast
          text={toast.text}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          color={toast.color}
        />
        <StudentPageControlPanel
          searchString={searchString}
          onSearchStringChange={handleSearchStringChange}
          sortOptions={studentColumns}
          sortCriteria={sortCriteria}
          onSortCriteriaChange={handleSortCriteriaChange}
          totalStudents={students?.length ?? 0}
          selectedStudentsCount={selectedStudentIds.size}
        />
        <TableWrap>
          <StudentTable
            data={processedStudents}
            columns={studentColumns}
            highlightColumn={sortCriteria.key.accessor}
            selectedRowIds={selectedStudentIds}
            onCheckboxChange={handleCheckboxChange}
            onDeleteRow={handleDeleteStudent}
            onEditRow={handleEditStudent}
          />
        </TableWrap>
      </Layout>
    </>
  );
}

export default withAuth(StudentPage);
