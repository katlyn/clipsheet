import { queryGViz } from "./gviz.ts";
import { ColumnMapping, createRowParser, ParsedRow } from "./parser.ts";
import extractSheetDetails from "./urls.ts";

/**
 * Fetch a sheet and return the parsed representation.
 * @param key Spreadsheet key
 * @param gid Spreadsheet GID
 * @param query The GViz query to execute. Leave blank to return all content in the sheet
 * @param mapping Map columns to property keys in the resulting object. If omitted, property keys will default to their
 * column identifier (e.g., "A")
 */
export async function fetchSheet<T extends ColumnMapping>(
  key: string,
  gid: string,
  query?: string,
  mapping?: T,
): Promise<ParsedRow<T>[]> {
  const { table } = await queryGViz(key, gid, query);
  const parser = createRowParser(mapping ?? ({} as T), table.cols);
  return table.rows.map(parser);
}

/**
 * Fetch a sheet from the given URL and return the parsed represenation.
 * @param url The URL to the spreadsheet. This must be the full URL, including any hashes at the end
 * @param query The GViz query to execute. Leave blank to return all content in the sheet
 * @param mapping Map columns to property keys in the resulting object. If omitted, property keys will default to their
 */
export function fetchSheetFromUrl<T extends ColumnMapping>(
  url: string,
  query?: string,
  mapping?: T,
): ReturnType<typeof fetchSheet> {
  const { key, gid } = extractSheetDetails(url);
  return fetchSheet(key, gid, query, mapping);
}

export default fetchSheetFromUrl;
