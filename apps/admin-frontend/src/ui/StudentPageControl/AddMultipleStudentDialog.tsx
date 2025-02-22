import type React from "react";
import { useState } from "react";
import Papa from "papaparse";
import FormDialog from "../FormDialog";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import type { NewStudent, NewStudentWithLectureLog } from "@/types/models";

const schoolConvert = {
  연세대학교: "YONSEI",
  서강대학교: "SOGANG",
  이화여자대학교: "EWHA",
  홍익대학교: "HONGIK",
  숙명여자대학교: "SOOKMYUNG",
};

function AddMultipleStudentDialog() {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0]);
    }
  };

  const parseCsvToStudents = async (file: File): Promise<NewStudent[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => {
          result.data.shift();
          const filteredResult = result.data.filter(
            (row: string[]) => !row || row[0] !== "",
          );
          const students: NewStudent[] = filteredResult.map(
            (row: string[]) => ({
              name: row[0],
              bojHandle: row[4],
              email: "",
              phone: row[2],
              school: schoolConvert[row[3]],
              studentNumber: row[1],
              // lectureInfo: {
              //   year: semester.year,
              //   season: semester.season,
              //   level: convertLectureLevel(row[5]),
              //   refundOption: convertRefundOption(row[6]),
              //   refundAccount: row[7],
              // },
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

    const parsedStudents = (await parseCsvToStudents(csvFile)).filter(
      (student: NewStudentWithLectureLog) =>
        student.name !== " " &&
        student.bojHandle !== " " &&
        student.phone !== " " &&
        student.studentNumber !== " ",
    );

    // console.log(parsedStudents);

    await adminAPI.post(API_URL.STUDENT.MULTIPLE, parsedStudents);
    setCsvFile(null);
  };

  return (
    <FormDialog
      title="학생 CSV로 추가"
      description="CSV 파일을 업로드하세요."
      onFormSubmit={handleFormSubmit}
    >
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </FormDialog>
  );
}

export default AddMultipleStudentDialog;
