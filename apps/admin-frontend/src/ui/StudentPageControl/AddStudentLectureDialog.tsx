import type React from "react";
import { useState } from "react";
import Papa from "papaparse";
import FormDialog from "../FormDialog";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import type { NewStudentLectureLogDto } from "@/types/models";
import { useSemester } from "@/contexts/SemesterContext";

function convertRefundOption(refund: string) {
  if (refund.startsWith("환급")) {
    return "Refund";
  }
  return "NonRefund";
}

function convertLectureLevel(level: string) {
  if (level.startsWith("Novice")) {
    return "Novice";
  }
  if (level.startsWith("Advanced")) {
    return "Advanced";
  }
  return "Expert";
}

function AddStudentLectureDialog() {
  const { currentSemester } = useSemester();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0]);
    }
  };

  const parseCsvToStudentLectureLog = async (
    file: File,
  ): Promise<NewStudentLectureLogDto[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => {
          result.data.shift();
          const filteredResult = result.data.filter(
            (row: string[]) => !row || row[0] !== "",
          );
          const students: NewStudentLectureLogDto[] = filteredResult.map(
            (row: string[]) => ({
              bojHandle: row[4],
              semesterId: currentSemester.id,
              level: convertLectureLevel(row[5]),
              refundOption: convertRefundOption(row[6]),
              refundAccount: row[7],
            }),
          );
          resolve(students);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const handleFormSubmit = async () => {
    if (!csvFile) {
      return;
    }

    const parsedStudents = (await parseCsvToStudentLectureLog(csvFile)).filter(
      (log: NewStudentLectureLogDto) =>
        log.bojHandle !== " " && log.refundAccount !== " ",
    );

    console.log(parsedStudents);

    await adminAPI.post(API_URL.STUDENT_LECTURE_LOG.MULTIPLE, parsedStudents);
    setCsvFile(null);
  };

  return (
    <FormDialog
      title="학생 강의 수강 로그를 CSV로 추가"
      description="CSV 파일을 업로드하세요."
      onFormSubmit={handleFormSubmit}
    >
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </FormDialog>
  );
}

export default AddStudentLectureDialog;
