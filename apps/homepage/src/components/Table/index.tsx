import * as styles from "./styles.css";

// 링크도 표시할 수 있다.
type Value = number | string | React.ReactNode;

type Column<T> = {
  key: keyof T;
  header: string;
};

type Item = {
  [key: string]: Value;
};

type TableProps<T extends Item> = {
  data: T[];
  columns: Column<T>[];
  fixedLayout?: boolean;
};

function DataTable<T extends Item>({
  columns,
  data,
  fixedLayout,
}: TableProps<T>) {
  return (
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
  );
}

export default DataTable;
