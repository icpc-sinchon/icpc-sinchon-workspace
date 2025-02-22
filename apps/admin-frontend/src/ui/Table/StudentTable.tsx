import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

import TableHead from "./TableHead";
import Spinner from "@/components/Spinner";
import { CheckboxTableProps, TableItem } from "./types";
import TableRow from "./TableRow";

/* 주어진 대로 표를 표시한다. */
function StudentTable<T extends TableItem>({
  data,
  columns,
  selectedRowIds,
  onCheckboxChange,
  onEditRow,
  onDeleteRow,
}: CheckboxTableProps<T>) {
  const handleCheckBoxChange = useCallback(
    (itemId: number) => {
      const newSelectedRowIds = new Set(selectedRowIds);
      if (newSelectedRowIds.has(itemId)) {
        newSelectedRowIds.delete(itemId);
      } else {
        newSelectedRowIds.add(itemId);
      }
      onCheckboxChange(newSelectedRowIds);
    },
    [selectedRowIds, onCheckboxChange],
  );

  const highlightAllRows = useCallback(() => {
    const allSelected = data.length === selectedRowIds.size;
    const newSelectedRows = allSelected
      ? new Set<number>()
      : new Set(data.map((item) => item.id));
    onCheckboxChange(newSelectedRows);
  }, [data, selectedRowIds, onCheckboxChange]);

  const isAllRowChecked = useMemo(
    () => data.length > 0 && data.length === selectedRowIds.size,
    [data.length, selectedRowIds.size],
  );

  return (
    <TableWrapper>
      {!data.length ? (
        // TODO: API 응답 실패시에는 NoDataPlaceholder, 로딩중일 시 Spinner 표시
        <Spinner />
      ) : (
        <StyledTable>
          <TableHead
            rowHeaderType="checkBox"
            columns={columns}
            onCheckAll={highlightAllRows}
            isAllChecked={isAllRowChecked}
          />
          <tbody>
            {data.map((item) => (
              <TableRow<T>
                key={item.id}
                item={item}
                columns={columns}
                rowHeaderType="checkbox"
                onCheckboxChange={handleCheckBoxChange}
                isChecked={selectedRowIds.has(item.id)}
                onEdit={onEditRow}
                onDelete={onDeleteRow}
              />
            ))}
          </tbody>
        </StyledTable>
      )}
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: auto;

  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.primaryBorder};
  }
`;

const StyledTable = styled.table`
  background-color: white;
  white-space: nowrap;

  border-collapse: collapse;
  font-family: "Apple SD Gothic Neo", sans-serif;
  font-size: 0.95rem;
`;

export default StudentTable;
