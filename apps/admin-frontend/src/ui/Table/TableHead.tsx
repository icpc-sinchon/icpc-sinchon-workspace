import styled from "styled-components";
import { Column, TableItem } from "./types";

type TableHeadProps<T extends TableItem> =
  | {
      rowHeaderType: "rowNumber";
      columns: Column<T>[];
      data: T[];
    }
  | {
      rowHeaderType: "checkBox";
      columns: Column<T>[];
      onCheckAll: () => void;
      isAllChecked: boolean;
    };

type TableHeaderProps =
  | {
      rowHeaderType: "rowNumber";
    }
  | {
      rowHeaderType: "checkBox";
      onCheckAll: () => void;
      isAllChecked: boolean;
    };

function TableHeader(props: TableHeaderProps) {
  const { rowHeaderType } = props;
  if (rowHeaderType === "rowNumber") {
    return <StickyThead />;
  }
  const { onCheckAll, isAllChecked } = props;
  return (
    <StickyThead>
      <input type="checkbox" onChange={onCheckAll} checked={isAllChecked} />
    </StickyThead>
  );
}

function TableHead<T extends TableItem>(props: TableHeadProps<T>) {
  // generalFilterModalTrigger 관련 함수는 context로 관리하도록 하자.
  const { rowHeaderType, columns } = props;
  if (rowHeaderType === "rowNumber") {
    return (
      <thead>
        <tr>
          <TableHeader rowHeaderType={rowHeaderType} />
          {columns.map((col, idx) => (
            <StickyThead
              key={String(col.accessor)}
              data-row={`r${idx + 1}`}
              data-col="c0"
            >
              <h4>{col.header}</h4>
            </StickyThead>
          ))}
          <StickyThead>편집</StickyThead>
        </tr>
      </thead>
    );
  }

  const { onCheckAll, isAllChecked } = props;

  return (
    <thead>
      <tr>
        <TableHeader
          rowHeaderType={rowHeaderType}
          onCheckAll={onCheckAll}
          isAllChecked={isAllChecked}
        />
        {columns.map((col, idx) => (
          <StickyThead
            key={String(col.accessor)}
            data-row={`r${idx + 1}`}
            data-col="c0"
          >
            <h4>{col.header}</h4>
          </StickyThead>
        ))}
        <StickyThead>편집</StickyThead>
      </tr>
    </thead>
  );
}

const StickyThead = styled.th`
  position: sticky;
  top: 0;
  padding: 0.3rem 1rem;
  overflow-x: auto;

  background-color: ${(props) => props.theme.colors.primaryBackground};
`;

export default TableHead;
