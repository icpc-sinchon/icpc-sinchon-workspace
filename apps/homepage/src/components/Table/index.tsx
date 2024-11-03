import * as styles from "./styles.css";

// 링크도 표시할 수 있다.
type Value = number | string | { label: string; url: string };

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

function renderValue(value: Value) {
  if (typeof value === "object") {
    return (
      <a
        href={value.url}
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        {value.label}
      </a>
    );
  }
  return value;
}

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
                {renderValue(row[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
