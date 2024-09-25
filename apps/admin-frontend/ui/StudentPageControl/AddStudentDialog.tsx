import React, { useState } from "react";
import { NewStudent, School, Payment, Level } from "@/types/models";
import FormDialog from "../FormDialog";
import FormInput from "@/components/Input";
import FormSelect from "@/components/Select";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import { useSemester } from "@/contexts/SemesterContext";

const emptyStudentData: NewStudent = {
  name: "",
  bojHandle: "",
  email: "",
  phone: "",
  school: "YONSEI",
  studentNumber: "",
  paymentStatus: "PAID_30000",
  refundAccount: "",
  lectureInfo: {
    // TODO: current season으로 변경하기
    year: 2021,
    season: "Summer",
    level: "Novice",
  },
};

function AddStudentDialog() {
  const { currentSemester } = useSemester();
  const [newStudent, setNewStudent] = useState({
    ...emptyStudentData,
    lectureInfo: {
      year: currentSemester.year,
      season: currentSemester.season,
      level: "Novice",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await adminAPI.post(API_URL.STUDENT.BASE, newStudent);
    setNewStudent(emptyStudentData);
  };

  return (
    <FormDialog title="학생 직접 추가" onFormSubmit={handleSubmit}>
      <FormInput
        name="name"
        label="이름"
        value={newStudent.name}
        onChange={handleChange}
        placeholder="이름을 입력하세요"
        required
      />
      <FormInput
        name="bojHandle"
        label="백준 핸들"
        value={newStudent.bojHandle}
        onChange={handleChange}
        placeholder="백준 핸들을 입력하세요"
        required
      />
      <FormInput
        type="email"
        name="email"
        label="이메일"
        value={newStudent.email}
        onChange={handleChange}
        placeholder="이메일을 입력하세요"
      />
      <FormInput
        type="tel"
        name="phone"
        label="전화번호"
        value={newStudent.phone}
        onChange={handleChange}
        placeholder="전화번호를 입력하세요"
      />
      <FormSelect
        label="학교"
        name="school"
        value={newStudent.school}
        defaultValue="YONSEI"
        onValueChange={(value: School) =>
          setNewStudent((prev) => ({ ...prev, school: value }))
        }
        options={[
          { value: "YONSEI", label: "연세대학교" },
          { value: "SOGANG", label: "서강대학교" },
          { value: "HONGIK", label: "홍익대학교" },
          { value: "EWHA", label: "이화여자대학교" },
          { value: "SOOKMYUNG", label: "숙명여자대학교" },
        ]}
      />
      <FormInput
        name="studentNumber"
        label="학번"
        value={newStudent.studentNumber}
        onChange={handleChange}
        placeholder="학번을 입력하세요"
        required
      />
      <FormSelect
        label="환급 유형"
        name="paymentStatus"
        value={newStudent.paymentStatus}
        defaultValue="PAID_30000"
        onValueChange={(value: Payment) =>
          setNewStudent((prev) => ({ ...prev, paymentStatus: value }))
        }
        options={[
          { value: "PAID_30000", label: "30000원" },
          { value: "PAID_60000", label: "60000원" },
        ]}
      />
      <FormInput
        name="refundAccount"
        label="환급 계좌"
        value={newStudent.refundAccount}
        onChange={handleChange}
        placeholder="환급 계좌를 입력하세요"
        required
      />
      {/* TODO: 현재 시즌의 정보를 기반으로 난이도 선택하도록 변경 */}
      <FormSelect
        label="난이도"
        name="level"
        value={newStudent.lectureInfo.level}
        defaultValue="Novice"
        onValueChange={(value: Level) =>
          setNewStudent((prev) => ({
            ...prev,
            lectureInfo: { ...prev.lectureInfo, level: value },
          }))
        }
        options={[
          { value: "Novice", label: "초급" },
          { value: "Advanced", label: "중급" },
        ]}
      />
    </FormDialog>
  );
}

export default AddStudentDialog;
