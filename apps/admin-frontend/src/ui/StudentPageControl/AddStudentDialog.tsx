import type React from "react";
import { useState } from "react";
import type { NewStudent, School, Payment, Level } from "@/types/models";
import FormDialog from "../FormDialog";
import FormInput from "@/components/Input";
import FormSelect from "@/components/Select";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";

const emptyStudentData: NewStudent = {
  name: "",
  bojHandle: "",
  phone: "",
  email: "",
  school: "YONSEI",
  studentNumber: "",
};

function AddStudentDialog() {
  const [newStudent, setNewStudent] = useState(emptyStudentData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log(newStudent);
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
    </FormDialog>
  );
}

export default AddStudentDialog;
