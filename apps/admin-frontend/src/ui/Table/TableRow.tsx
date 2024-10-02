import styled from "styled-components";
import React, { useState } from "react";
import { Button, Select, Switch, TextField } from "@radix-ui/themes";
import { TableRowProps, TableItem, Column } from "./types";

function TableRow<T extends TableItem>(props: TableRowProps<T>) {
  const { rowHeaderType, item, columns, highlightColumn, onEdit, onDelete } =
    props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<T>(item);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedItem);
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  const handleInputChange = (accessor: keyof T, value: any) => {
    setEditedItem((prev) => ({
      ...prev,
      [accessor]: value,
    }));
  };

  const renderRowHeader = () => {
    if (rowHeaderType === "rowNumber") {
      const { rowIndex } = props;
      return <RowHeaderCell>{rowIndex + 1}</RowHeaderCell>;
    }
    const { isChecked, onCheckboxChange } = props;
    return (
      <RowHeaderCell>
        <input
          type="checkbox"
          onChange={() => onCheckboxChange(item.id)}
          checked={isChecked}
        />
      </RowHeaderCell>
    );
  };

  const renderCell = (col: Column<T>) => {
    if (!isEditing || col.inputType === "none") {
      return <div>{String(item[col.accessor])}</div>;
    }

    switch (col.inputType) {
      case "text":
        return (
          <TextField.Root
            size="1"
            value={String(editedItem[col.accessor])}
            onChange={(e) => handleInputChange(col.accessor, e.target.value)}
          />
        );
      case "select":
        return (
          <Select.Root
            size="1"
            defaultValue={String(editedItem[col.accessor])}
            value={String(editedItem[col.accessor])}
            onValueChange={(v: string) => handleInputChange(col.accessor, v)}
          >
            <Select.Trigger />
            <Select.Content>
              {col.options.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        );
      case "toggle":
        return (
          <Switch
            size="1"
            checked={editedItem[col.accessor]}
            onCheckedChange={(e) => handleInputChange(col.accessor, e)}
          />
        );
      default:
        return <div>{String(item[col.accessor])}</div>;
    }
  };

  return (
    <tr>
      {renderRowHeader()}
      {columns.map((col) => (
        <TableCell
          key={col.accessor.toString()}
          $highlight={highlightColumn === col.accessor}
        >
          {renderCell(col)}
        </TableCell>
      ))}
      <TableCell>
        <Button size="1" onClick={handleEdit} variant="surface">
          {isEditing ? "저장" : "수정"}
        </Button>
        <Button size="1" onClick={handleDelete} color="red">
          삭제
        </Button>
      </TableCell>
    </tr>
  );
}

export default TableRow;

const TableCell = styled.td<{ $highlight?: boolean }>`
  padding: 0.3rem 0.4rem;

  background-color: ${(props) =>
    props.$highlight ? props.theme.colors.secondaryBackground : "transparent"};

  max-width: 44rem;
  overflow-x: auto;
  outline: none;
`;

const RowHeaderCell = styled.td`
  width: 2rem;
  padding: 0.3rem 0.4rem;

  overflow-x: auto;

  // stickyIndex
  position: sticky;
  left: 0;
  font-weight: 500;
`;
