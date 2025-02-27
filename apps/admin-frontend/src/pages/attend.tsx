import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import Layout from "@/ui/Layout";
import { TableWrap } from "@/ui/Table/TableStyles";

import type {
  Level,
  Student,
  StudentAttendance,
  WeeklyAttendLog,
} from "@/types/models";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import AttendTable from "@/ui/Table/AttendTable";
import { useLectures, useSemester } from "@/contexts/SemesterContext";
import Toast from "@/components/Toast";
import { COLORS } from "@/styles/colors";
import Spinner from "@/components/Spinner";
import AttendPageControlPanel from "@/ui/AttendPageControl";
import { Lecture, Semester } from "@/types/setting";

type ChangedAttendLog = {
  studentId: number;
  lectureId: number;
  round: number;
  lectureDone: boolean;
  taskDone: boolean;
};

function StudentAttendPage() {
  const { currentSemester } = useSemester();
  const { lectures } = useLectures(currentSemester);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(0);

  const [toast, setToast] = useState({
    show: false,
    text: "",
    color: COLORS.primarySurface,
  });
  const [attendances, setAttendances] = useState<StudentAttendance[]>([]);
  const [editedAttendance, setEditedAttendance] = useState<StudentAttendance[]>(
    [],
  );

  const lectureLevelOptions = lectures.map<Level>((lecture) => lecture.level);
  const lectureBojGroupId = lectures[selectedLectureIndex]?.bojGroupId;
  const lectureTasks = lectures[selectedLectureIndex]?.task;

  useEffect(() => {
    if (!currentSemester || !lectures || !lectures.length) return;
    console.log(lectures);
    adminAPI
      .get(API_URL.STUDENT_ATTENDANCE.BASE, {
        params: {
          semesterId: currentSemester.id,
          lectureLevel: lectures[selectedLectureIndex].level,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAttendances(res.data);
        setEditedAttendance(res.data);
      });
  }, [currentSemester, selectedLectureIndex, lectures[selectedLectureIndex]]);

  if (!currentSemester || !lectures || !lectures.length) {
    return <div>로딩 중...</div>;
  }

  const handleLectureChange = (lectureLevel: Level) => {
    const index = lectureLevelOptions.indexOf(lectureLevel);
    setSelectedLectureIndex(index);
  };

  const handleSaveChanges = async () => {
    const changedLogs: ChangedAttendLog[] = [];

    editedAttendance.forEach((edited, studentIndex) => {
      const original = attendances[studentIndex];

      edited.attendLog.forEach((editedLog, logIndex) => {
        const originalLog = original.attendLog[logIndex];

        if (
          editedLog.lectureDone !== originalLog.lectureDone ||
          editedLog.taskDone !== originalLog.taskDone
        ) {
          changedLogs.push({
            studentId: edited.studentId,
            lectureId: edited.lectureId,
            round: editedLog.round,
            lectureDone: editedLog.lectureDone,
            taskDone: editedLog.taskDone,
          });
        }
      });
    });

    if (changedLogs.length === 0) {
      setToast({
        show: true,
        text: "변경된 내용이 없습니다.",
        color: COLORS.primarySurface,
      });
      return;
    }

    await adminAPI.patch(API_URL.STUDENT_ATTENDANCE.MULTIPLE, {
      updates: changedLogs,
    });

    setToast({
      show: true,
      text: `${changedLogs.length}개의 출석 정보가 수정되었습니다.`,
      color: COLORS.primarySurface,
    });

    // todo: 업데이트 후 refresh
    console.log(changedLogs);
  };

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
          lectureLevelOptions={lectureLevelOptions}
          selectedLectureIndex={selectedLectureIndex}
          onLectureChange={handleLectureChange}
          lectureBojGroupId={lectureBojGroupId}
          tasks={lectureTasks}
          onSaveChanges={handleSaveChanges}
        />
        <TableWrap>
          {!attendances.length ? (
            <Spinner />
          ) : (
            <AttendTable
              editingData={editedAttendance}
              onAttendanceChange={setEditedAttendance}
            />
          )}
        </TableWrap>
      </Layout>
    </>
  );
}

export default StudentAttendPage;
