import React from "react";
import styled from "styled-components";

import TableHead from "./TableHead";
import Spinner from "@/components/Spinner";
import { TableItem, TableProps } from "./types";
import TableRow from "./TableRow";

/* 주어진 대로 표를 표시한다. */
function Table<T extends TableItem>({
  data,
  columns,
  onEditRow,
  onDeleteRow,
}: TableProps<T>) {
  return (
    <TableWrapper>
      {!data.length ? (
        // TODO: API 응답 실패시에는 NoDataPlaceholder, 로딩중일 시 Spinner 표시
        <Spinner />
      ) : (
        <StyledTable>
          <TableHead rowHeaderType="rowNumber" data={data} columns={columns} />
          <tbody>
            {data.map((item, rowIndex) => (
              <TableRow<T>
                key={item.id}
                item={item}
                columns={columns}
                highlightColumn={null}
                rowIndex={rowIndex}
                rowHeaderType="rowNumber"
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

export default Table;
