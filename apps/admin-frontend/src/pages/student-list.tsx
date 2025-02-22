import Head from "next/head";
import Layout from "@/ui/Layout";
import { useEffect, useState } from "react";
import { COLORS } from "@/styles/colors";
import Toast from "@/components/Toast";
import { Student } from "@/types/models";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import { TableWrap } from "@/ui/Table/TableStyles";
import StudentTable from "@/ui/Table/StudentTable";
import { Column } from "@/ui/Table/types";
import { sortByName } from "@/utils/format";
import PageControlLayout from "@/ui/PageControlLayout";
import { Button, Flex, Grid, Heading, Separator, Text } from "@radix-ui/themes";
import AddStudentDialog from "@/ui/StudentPageControl/AddStudentDialog";
import AddMultipleStudentDialog from "@/ui/StudentPageControl/AddMultipleStudentDialog";

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
];

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

function StudentList() {
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(
    new Set(),
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [toast, setToast] = useState({
    show: false,
    text: "",
    color: COLORS.primarySurface,
  });

  useEffect(() => {
    adminAPI.get<Student[]>(API_URL.STUDENT.BASE).then((res) => {
      console.log(res.data);
      const sortedStudents = sortByName(res.data);
      setStudents(sortedStudents);
    });
  }, []);

  const handleDeleteStudent = async (itemId: number) => {
    try {
      await adminAPI.delete(API_URL.STUDENT.byId(itemId));
      setStudents(students.filter((student) => student.id !== itemId));
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

  const deleteSelectedStudents = async (selectedIds: Set<number>) => {
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        adminAPI.delete(API_URL.STUDENT.byId(id)),
      );
      await Promise.all(deletePromises);
      const updatedStudents = students.filter(
        (student) => !selectedIds.has(student.id),
      );
      setStudents(updatedStudents);
      setToast({
        show: true,
        text: "학생 삭제 완료",
        color: COLORS.primarySurface,
      });
      setSelectedStudentIds(new Set());
    } catch (err) {
      console.error("Failed to delete students:", err);
      setToast({
        show: true,
        text: "학생 삭제 실패",
        color: COLORS.errorText,
      });
    }
  };

  const handleEditStudent = async (editedItem: Student) => {
    try {
      // TODO: lectureLevels가 있으면 student에서 수정하도록 수정
      // TODO: 강의 레벨은 select로 수정하도록 하자.
      const studentEditData = formatEditStudent(editedItem);
      await adminAPI.patch(
        API_URL.STUDENT.byId(editedItem.id),
        studentEditData,
      );
      const updatedStudents = students.map((student) =>
        student.id === editedItem.id ? editedItem : student,
      );
      setStudents(updatedStudents);
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

  const handleCheckboxChange = (selectedIds: Set<number>) => {
    setSelectedStudentIds(selectedIds);
  };

  return (
    <>
      <Head>
        <title>학생 명단 관리 | ICPC Admin</title>
      </Head>
      <Layout
        title="학생 명단 관리"
        description="학생들의 명단을 관리할 수 있습니다."
      >
        <Toast
          text={toast.text}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          color={toast.color}
        />
        <PageControlLayout>
          <Flex gap="1" direction="column" justify="center">
            <Heading as="h3" size="4">
              학생 관리
            </Heading>
            <Grid rows="auto auto" columns="auto auto" gap="2" flow="column">
              <AddStudentDialog />
              <AddMultipleStudentDialog />
              <Text as="p" size="3">
                전체 : {students.length}명, 체크된 학생 :{" "}
                {selectedStudentIds.size}명
              </Text>
              <Button
                size="2"
                color="cyan"
                onClick={() => deleteSelectedStudents(selectedStudentIds)}
              >
                체크된 학생 삭제
              </Button>
            </Grid>
          </Flex>
        </PageControlLayout>
        <TableWrap>
          <StudentTable
            data={students}
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

export default StudentList;
