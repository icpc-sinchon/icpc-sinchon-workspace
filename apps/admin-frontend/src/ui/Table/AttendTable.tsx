import styled from "styled-components";
import { Button, Switch } from "@radix-ui/themes";
import { useState } from "react";
import type { StudentAttendance } from "@/types/models";
import Spinner from "@/components/Spinner";

// TODO: 전체 회차에 따라 Attendance의 배열 길이가 달라지는 걸 타입으로 만들 수 있을지도?
// 출석은 수정만 가능
export type Props = {
  data: StudentAttendance[];
  onEditRow: (editedItem: StudentAttendance) => void;
};

// const attendColumns: Column<Attendance>[] = [
//   { header: "핸들", accessor: "bojHandle", inputType: "none" },
//   {
//     header: "출석",
//     accessor: "attended",
//     inputType: "array",
//     columns: [
//       { header: "강의", accessor: "lecture", inputType: "none" },
//       { header: "과제", accessor: "task", inputType: "none" },
//     ],
//   },
//   { header: "환급조건 강의", accessor: "lectureRefund", inputType: "none" },
//   { header: "환급조건 과제", accessor: "taskRefund", inputType: "none" },
// ];

function WeekAttendance({
  lecture,
  task,
  isEditing,
  onAttendanceChange,
}: {
  lecture: boolean;
  task: boolean;
  isEditing: boolean;
  onAttendanceChange: (type: "lectureDone" | "taskDone") => void;
}) {
  if (isEditing) {
    return (
      <>
        <td>
          <Switch
            size="2"
            checked={lecture}
            onCheckedChange={() => onAttendanceChange("lectureDone")}
          />
        </td>
        <td>
          <Switch
            size="2"
            checked={task}
            onCheckedChange={() => onAttendanceChange("taskDone")}
          />
        </td>
      </>
    );
  }
  return (
    <>
      <td>{lecture ? "O" : ""}</td>
      <td>{task ? "O" : ""}</td>
    </>
  );
}

function AttendTableRow({
  rowIndex,
  item,
  onEdit,
}: {
  rowIndex: number;
  item: StudentAttendance;
  onEdit: (editedItem: StudentAttendance) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<StudentAttendance>(item);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedItem);
    }
    setIsEditing(!isEditing);
  };

  const handleAttendanceChange = (
    round: number,
    type: "lectureDone" | "taskDone",
  ) => {
    const newAttendance = [...editedItem.attendLog];
    newAttendance[round - 1] = {
      ...newAttendance[round - 1],
      [type]: !newAttendance[round - 1][type],
    };
    setEditedItem((prev) => ({
      ...prev,
      attendLog: newAttendance,
    }));
  };

  const totalWeeks = item.attendLog.length;

  return (
    <tr>
      <td>{rowIndex + 1}</td>
      <td>{editedItem.name}</td>
      <td>{editedItem.bojHandle}</td>
      {editedItem.attendLog.map((log) => (
        <WeekAttendance
          key={log.round}
          lecture={log.lectureDone}
          task={log.taskDone}
          isEditing={isEditing}
          onAttendanceChange={(type) => handleAttendanceChange(log.round, type)}
        />
      ))}
      <td>
        {editedItem.attendLog.filter((log) => log.lectureDone).length} /{" "}
        {totalWeeks}
      </td>
      <td>
        {editedItem.attendLog.filter((log) => log.taskDone).length} /{" "}
        {totalWeeks}
      </td>
      <td>{editedItem.refundAmount}</td>
      <td>{editedItem.refundAccount}</td>
      <td>
        <Button size="1" onClick={handleEdit} variant="surface">
          {isEditing ? "저장" : "수정"}
        </Button>
      </td>
    </tr>
  );
}

function AttendTable({ data, onEditRow }: Props) {
  if (data.length === 0) {
    return <Spinner />;
  }

  const totalWeeks = data[0].attendLog.length;

  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledTh rowSpan={2}>번호</StyledTh>
          <StyledTh rowSpan={2}>이름</StyledTh>
          <StyledTh rowSpan={2}>핸들</StyledTh>
          {Array.from({ length: totalWeeks }, (_, i) => (
            <StyledTh colSpan={2} key={i + 1}>
              {i + 1}회차
            </StyledTh>
          ))}
          <StyledTh colSpan={2}>환급조건</StyledTh>
          <StyledTh rowSpan={2}>환급금액</StyledTh>
          <StyledTh rowSpan={2}>환급계좌</StyledTh>
          <StyledTh rowSpan={2}>편집</StyledTh>
        </tr>
        <tr>
          {Array.from({ length: totalWeeks * 2 }, (_, i) => (
            <StyledTh key={i}>{i % 2 === 0 ? "강의" : "과제"}</StyledTh>
          ))}
          <StyledTh>강의</StyledTh>
          <StyledTh>과제</StyledTh>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <AttendTableRow
            key={item.studentId}
            rowIndex={idx}
            item={item}
            onEdit={onEditRow}
          />
        ))}
      </tbody>
    </StyledTable>
  );
}

export default AttendTable;

const StyledTable = styled.table`
  background-color: white;
  white-space: nowrap;

  border: 1px solid ${({ theme }) => theme.colors.primaryBorder};
  border-collapse: collapse;
  font-family: "Apple SD Gothic Neo", sans-serif;
  font-size: 0.95rem;

  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.primaryBorder};
  }
`;

const StyledTh = styled.th`
  position: sticky;
  top: 0;

  padding: 0.3rem 0.4rem;
  max-width: 44rem;
  overflow-x: auto;

  background-color: ${({ theme }) => theme.colors.primaryBackground};
  border: 1px solid ${({ theme }) => theme.colors.primaryBorder};
`;
