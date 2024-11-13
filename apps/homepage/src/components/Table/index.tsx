import * as styles from "./styles.css";

// 링크도 표시할 수 있다.
type Value = number | string | React.ReactNode;

export type Column<T> = {
  key: keyof T;
  header: string;
};

export type TableItem = {
  [key: string]: Value;
};

type TableProps<T extends TableItem> = {
  data: T[];
  columns: Column<T>[];
  fixedLayout?: boolean;
};

// TODO: 테이블의 각 컬럼 너비 조절 기능?
function DataTable<T extends TableItem>({
  columns,
  data,
  fixedLayout,
}: TableProps<T>) {
  return (
    <div className={styles.container}>
      <table
        className={`${styles.table} ${fixedLayout ? styles.fixedLayout : ""}`}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className={styles.tableHeader}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.tableRow}>
              {columns.map((column) => (
                <td key={String(column.key)} className={styles.tableData}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
