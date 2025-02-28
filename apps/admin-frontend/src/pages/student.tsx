import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "@/ui/Layout";
import { TableWrap } from "@/ui/Table/TableStyles";
import type { Column } from "@/ui/Table/types";

import { adminAPI } from "@/utils/api";
import type { Student, StudentWithLectureLog } from "@/types/models";
import StudentTable from "@/ui/Table/StudentTable";
import { API_URL } from "@/types/apis";
import { useSemester } from "@/contexts/SemesterContext";
import { COLORS } from "@/styles/colors";
import Toast from "@/components/Toast";

import { sortByName } from "@/utils/format";
import PageControlLayout from "@/ui/PageControlLayout";
import AddStudentLectureDialog from "@/ui/StudentPageControl/AddStudentLectureDialog";

// 학생 정보를 표시하는 컬럼들

export const studentColumns: Column<
  ReturnType<typeof formatStudentWithLectureLog>
>[] = [
  { header: "고유번호", accessor: "studentId", inputType: "none" },
  { header: "이름", accessor: "name", inputType: "none" },
  {
    header: "학교",
    accessor: "school",
    inputType: "none",
  },
  { header: "학번", accessor: "studentNumber", inputType: "none" },
  { header: "BOJ 핸들", accessor: "bojHandle", inputType: "none" },
  // { header: "이메일", accessor: "email", inputType: "text" },
  { header: "연락처", accessor: "phone", inputType: "none" },
  {
    header: "환급 유형",
    accessor: "refundOption",
    inputType: "select",
    options: [
      { value: "Refund", label: "환급" },
      { value: "NonRefund", label: "비환급" },
    ],
  },
  {
    header: "난이도",
    accessor: "level",
    inputType: "none",
  },
  {
    header: "환급 계좌",
    accessor: "refundAccount",
    inputType: "text",
  },
];

// 즉 여기의 id는 studentId가 아니라 학생의 강의 수강 log의 id
const formatStudentWithLectureLog = (student: StudentWithLectureLog) => {
  const { lectureLogs, ...rest } = student;

  // 초급과 중급이 있을 시 중급을 우선으로 표시
  const log =
    lectureLogs.length === 1
      ? lectureLogs[0]
      : lectureLogs.find((log) => log.level === "Advanced") ?? lectureLogs[0];

  const result = { ...rest, ...log, studentId: rest.id, id: log.id };
  return result;
};

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

function StudentLecturePage() {
  const { currentSemester } = useSemester();
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(
    new Set(),
  );
  const [students, setStudents] = useState<StudentWithLectureLog[]>([]);
  const [toast, setToast] = useState({
    show: false,
    text: "",
    color: COLORS.primarySurface,
  });

  useEffect(() => {
    adminAPI
      .get<StudentWithLectureLog[]>(API_URL.STUDENT_LECTURE.BASE, {
        params: { year: currentSemester.year, season: currentSemester.season },
      })
      .then((res) => {
        setStudents(sortByName(res.data));
      });
  }, [currentSemester]);

  const formattedStudents = students.map(formatStudentWithLectureLog);

  // if (isLoading || error) return <div>Loading...</div>;

  const handleCheckboxChange = (selectedIds: Set<number>) => {
    setSelectedStudentIds(selectedIds);
  };

  const handleDeleteStudent = async (itemId: number) => {
    try {
      await adminAPI.delete(API_URL.STUDENT_LECTURE_LOG.byId(itemId));
      setStudents((prev) => prev.filter((student) => student.id !== itemId));
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
  const handleEditStudent = async (
    editedItem: ReturnType<typeof formatStudentWithLectureLog>,
  ) => {
    try {
      // TODO: lectureLevels가 있으면 student에서 수정하도록 수정
      // TODO: 강의 레벨은 select로 수정하도록 하자.
      const studentEditData = formatEditStudent(editedItem);
      console.log("studentEditData", studentEditData);
      await adminAPI.patch(
        API_URL.STUDENT_LECTURE_LOG.byId(editedItem.id),
        studentEditData,
      );

      // TODO: 수정된 학생 정보를 state에 반영
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
        <title>강의 수강 관리 | ICPC Admin</title>
      </Head>
      <Layout
        title="수강 관리"
        description="학생들의 강의 수강 정보를 관리할 수 있습니다."
      >
        <Toast
          text={toast.text}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          color={toast.color}
        />
        <PageControlLayout>
          <AddStudentLectureDialog />
        </PageControlLayout>
        <TableWrap>
          <StudentTable
            data={formattedStudents}
            columns={studentColumns}
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

export default StudentLecturePage;
