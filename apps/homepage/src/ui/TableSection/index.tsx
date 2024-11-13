import DataTable, { type Column, type TableItem } from "@components/Table";
import Title from "@components/Title";
import * as styles from "./styles.css";

type Props<Data extends TableItem> = {
  title: string;
  titleBadge?: string;
  data: Data[];
  columns: Column<Data>[];
  fixedLayout?: boolean;
};

function TableSection<Data extends TableItem>({
  title,
  titleBadge,
  data,
  columns,
  fixedLayout,
}: Props<Data>) {
  return (
    <section className={styles.container}>
      <Title badge={titleBadge}>{title}</Title>
      <DataTable data={data} columns={columns} fixedLayout={fixedLayout} />
    </section>
  );
}

export default TableSection;
