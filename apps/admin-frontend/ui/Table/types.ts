export type TableItem = {
  id: number;
  [key: string]: any;
};

// none은 수정 불가능한 열, text는 텍스트 입력, toggle은 토글 버튼, select는 선택지가 있는 셀
// column에 해당하는 열을 수정할 때의 타입을 정의한다
type ColumnEditType =
  | { inputType: "none" | "text" | "toggle" }
  | {
      inputType: "select";
      options: { value: string; label: string }[];
    };

export type Column<T extends Record<string, any>> = {
  header: string;
  accessor: keyof T;
} & ColumnEditType;

// 테이블의 행들이 어떤 기준으로 정렬되어 있는지를 나타내는 타입
export type TableSortState<T extends Record<string, any>> = {
  key: Column<T>;
  order: "asc" | "desc";
};

export type TableProps<T extends TableItem> = {
  data: T[];
  columns: Column<T>[];
  onEditRow: (editedItem: T) => void;
  onDeleteRow: (itemId: number) => void;
};

export type CheckboxTableProps<T extends TableItem> = TableProps<T> & {
  // 아무 열도 하이라이트하지 않은 상태가 null
  highlightColumn: keyof T | null;
  selectedRowIds: Set<number>;
  onCheckboxChange: (selectedRowIds: Set<number>) => void;
};

export type TableRowCommonProps<T extends TableItem> = {
  // 표에서 렌더링할 객체
  item: T;
  columns: Column<T>[];
  // 열 하나에 하이라이트를 넣을 수 있다
  // 아무 열도 하이라이트하지 않은 상태가 null
  highlightColumn: keyof T | null;
  onEdit: (editedItem: T) => void;
  onDelete: (itemId: number) => void;
};

export type TableRowProps<T extends TableItem> = TableRowCommonProps<T> &
  (
    | {
        rowHeaderType: "rowNumber";
        rowIndex: number;
      }
    | {
        rowHeaderType: "checkbox";
        isChecked: boolean;
        onCheckboxChange: (itemId: number) => void;
      }
  );
