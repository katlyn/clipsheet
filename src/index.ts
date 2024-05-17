import { queryGViz } from "@internal/gviz";
import { ColumnMapping, createRowParser } from "@internal/parser";

export * as gviz from "./gviz";
export * as parser from "./parser";

export default async function getSheet<T extends ColumnMapping>(
  key: string,
  gid: string,
  query: string,
  mapping?: T,
) {
  const { table } = await queryGViz(key, gid, query);
  const parser = createRowParser(mapping ?? {}, table.cols);
  return table.rows.map(parser);
}
