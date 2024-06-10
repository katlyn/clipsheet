import { queryGViz } from "./gviz";
import { ColumnMapping, createRowParser, ParsedRow } from "./parser";

export * as gviz from "./gviz";
export * as parser from "./parser";

export default async function getSheet<T extends ColumnMapping>(
  key: string,
  gid: string,
  query: string,
  mapping?: T,
): Promise<ParsedRow<T>[]> {
  const { table } = await queryGViz(key, gid, query);
  const parser = createRowParser(mapping ?? ({} as T), table.cols);
  return table.rows.map(parser);
}
