/**
 * Contains functions to facilitate fetching the data in a sheet.
 * @module
 */

import { queryGViz } from "./gviz";
import { ColumnMapping, createRowParser, ParsedRow } from "./parser";

/**
 * Fetch a sheet and return the parsed representation.
 * @param key Spreadsheet key
 * @param gid Spreadsheet GID
 * @param query The GViz query to execute. Leave blank to return all content in the sheet
 * @param mapping Map columns to property keys in the resulting object. If omitted, property keys will default to their
 * column identifier (e.g., "A")
 */
export default async function fetchSheet<T extends ColumnMapping>(
  key: string,
  gid: string,
  query?: string,
  mapping?: T,
): Promise<ParsedRow<T>[]> {
  const { table } = await queryGViz(key, gid, query);
  const parser = createRowParser(mapping ?? ({} as T), table.cols);
  return table.rows.map(parser);
}
