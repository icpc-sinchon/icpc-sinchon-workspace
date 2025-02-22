import styled from "styled-components";
import { Button, Switch } from "@radix-ui/themes";
import React, { useState } from "react";
import type { StudentAttendance } from "@/types/models";
import Spinner from "@/components/Spinner";

// TODO: 전체 회차에 따라 Attendance의 배열 길이가 달라지는 걸 타입으로 만들 수 있을지도?
// 출석은 수정만 가능
export type AttendanceTableProps = {
  editingData: StudentAttendance[];
  onAttendanceChange: React.Dispatch<React.SetStateAction<StudentAttendance[]>>;
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

function AttendTableRow({
  rowIndex,
  rowAttendance,
  onRowAttendanceChange,
}: {
  rowIndex: number;
  rowAttendance: StudentAttendance;
  onRowAttendanceChange: (newAttendance: StudentAttendance) => void;
}) {
  const totalWeeks = rowAttendance.attendLog.length;

  const handleRowAttendanceChange = (
    round: number,
    type: "lectureDone" | "taskDone",
  ) => {
    const newAttendLog = [...rowAttendance.attendLog];

    newAttendLog[round - 1] = {
      ...newAttendLog[round - 1],
      [type]: !newAttendLog[round - 1][type],
    };
    onRowAttendanceChange({ ...rowAttendance, attendLog: newAttendLog });
  };

  return (
    <tr>
      <td>{rowIndex + 1}</td>
      <td>{rowAttendance.name}</td>
      <td>{rowAttendance.bojHandle}</td>
      {rowAttendance.attendLog.map((log) => (
        <React.Fragment key={log.round}>
          <td>
            <Switch
              size="2"
              checked={log.lectureDone}
              onCheckedChange={() =>
                handleRowAttendanceChange(log.round, "lectureDone")
              }
            />
          </td>
          <td>
            <Switch
              size="2"
              checked={log.taskDone}
              onCheckedChange={() =>
                handleRowAttendanceChange(log.round, "taskDone")
              }
            />
          </td>
        </React.Fragment>
      ))}
      <td>
        {rowAttendance.attendLog.filter((log) => log.lectureDone).length} /{" "}
        {totalWeeks}
      </td>
      <td>
        {rowAttendance.attendLog.filter((log) => log.taskDone).length} /{" "}
        {totalWeeks}
      </td>
      <td>{rowAttendance.refundAmount}</td>
      <td>{rowAttendance.refundAccount}</td>
    </tr>
  );
}

function AttendTable({
  editingData,
  onAttendanceChange,
}: AttendanceTableProps) {
  if (editingData.length === 0) {
    return <Spinner />;
  }

  const totalWeeks = editingData[0].attendLog.length;

  const handleRowAttendanceChange = (newAttendance: StudentAttendance) => {
    const newEditingData = [...editingData];
    newEditingData[
      newEditingData.findIndex(
        (attendance) => attendance.studentId === newAttendance.studentId,
      )
    ] = newAttendance;
    onAttendanceChange(newEditingData);
  };

  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledTh rowSpan={2}>#</StyledTh>
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
        {editingData.map((item, idx) => (
          <AttendTableRow
            key={item.studentId}
            rowIndex={idx}
            rowAttendance={item}
            onRowAttendanceChange={handleRowAttendanceChange}
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
