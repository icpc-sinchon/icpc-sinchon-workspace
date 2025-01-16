import Head from "next/head";
import { useCallback, useState } from "react";
import useSWR from "swr";
import Layout from "@/ui/Layout";
import { TableWrap } from "@/ui/Table/TableStyles";

import type { Level, StudentAttendance } from "@/types/models";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import AttendTable from "@/ui/Table/AttendTable";
import { useSemester } from "@/contexts/SemesterContext";
import Toast from "@/components/Toast";
import { COLORS } from "@/styles/colors";
import Spinner from "@/components/Spinner";
import AttendPageControlPanel from "@/ui/AttendPageControl";

// function getFormattedAttendance(
//   attendance: StudentAttendance,
// ): FormattedAttendance {
//   return {
//     ...attendance,
//     attendLog: attendance.attendLog.map((week) => ({
//       round: week.round,
//       lectureDone: week.lectureDone ? "O" : "",
//       taskDone: week.taskDone ? "O" : "",
//     })),
//     lectureRefund: false,
//     taskRefund: false,
//   };
// }

// const attendColumns: Column<FormattedAttendance>[] = [
//   { header: "핸들", accessor: "bojHandle", inputType: "none" },
//   {
//     header: "출석",
//     accessor: "attended",
//     inputType: "array",
//     columns: [
//       { header: "강의", accessor: "lectureDone", inputType: "none" },
//       { header: "과제", accessor: "taskDone", inputType: "none" },
//     ],
//   },
//   { header: "환급조건 강의", accessor: "lectureRefund", inputType: "none" },
//   { header: "환급조건 과제", accessor: "taskRefund", inputType: "none" },
// ];

const attendFetcher = ([url, year, season, lectureLevel]: [
  string,
  number,
  string,
  string,
]) =>
  adminAPI
    .get<StudentAttendance[]>(url, {
      params: { year, season, lectureLevel },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    });

function StudentAttendPage() {
  const { currentSemester } = useSemester();

  const [searchString, setSearchString] = useState("");
  const [level, setLevel] = useState<Level>("Novice");
  const [toast, setToast] = useState({
    show: false,
    text: "",
    color: COLORS.primarySurface,
  });

  const {
    data: attendance,
    isLoading,
    error,
    mutate,
  } = useSWR<StudentAttendance[]>(
    [
      API_URL.STUDENT_ATTENDANCE.BASE,
      currentSemester.year,
      currentSemester.season,
      level,
    ],
    attendFetcher,
  );

  const handleEditRow = async (editedItem: StudentAttendance) => {
    try {
      await adminAPI.patch(
        API_URL.STUDENT_ATTENDANCE.byStudentId(editedItem.studentId),
        {
          year: currentSemester.year,
          season: currentSemester.season,
          lectureLevel: level,
          attendLog: editedItem.attendLog,
        },
      );
      mutate();
      setToast({
        show: true,
        text: `${editedItem.name}(${editedItem.bojHandle}) 학생의 출석 정보가 수정되었습니다.`,
        color: COLORS.primarySurface,
      });
    } catch (_) {
      console.error("Failed to edit attendance:", error);
      setToast({
        show: true,
        text: `${editedItem.name}(${editedItem.bojHandle}) 학생의 출석 정보 수정에 실패했습니다.`,
        color: COLORS.errorText,
      });
    }
  };

  const handleLevelChange = useCallback((newLevel: Level) => {
    setLevel(newLevel);
  }, []);

  const handleSearchStringChange = useCallback((value: string) => {
    setSearchString(value);
  }, []);

  const filteredAttendance =
    attendance?.filter((attend) =>
      attend.bojHandle.toLowerCase().includes(searchString.toLowerCase()),
    ) || [];

  if (error) {
    setToast({
      show: true,
      text: "출석 정보를 불러오는데 실패했습니다.",
      color: COLORS.errorText,
    });
    return <div>Error loading attendance</div>;
  }

  if (isLoading || error) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title> 출석 관리 | ICPC Admin</title>
      </Head>
      <Layout title="출석 관리" description="강의와 과제 출석을 관리합니다.">
        <Toast
          text={toast.text}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          color={toast.color}
        />
        <AttendPageControlPanel
          searchString={searchString}
          onSearchStringChange={handleSearchStringChange}
          level={level}
          onLevelChange={handleLevelChange}
        />
        <TableWrap>
          {!attendance ? (
            <Spinner />
          ) : (
            <AttendTable data={filteredAttendance} onEditRow={handleEditRow} />
          )}
        </TableWrap>
      </Layout>
    </>
  );
}

export default StudentAttendPage;
