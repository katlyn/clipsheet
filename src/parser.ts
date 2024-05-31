import { GVizCell, GVizCol, GVizRow } from "@internal/gviz";

export type ColumnMapping = Record<string, string>;
export type ParsedRow<M extends ColumnMapping> = {
  [K in keyof M as M[K]]: string;
};

type RowParser<T extends ColumnMapping> = (row: GVizRow) => ParsedRow<T>;

export function createRowParser<T extends ColumnMapping>(
  mapping: T,
  cols: GVizCol[],
): RowParser<T> {
  const parsers = {
    boolean: (cell: GVizCell) => cell.v,
    string: (cell: GVizCell) => cell.v,
    number: (cell: GVizCell) => cell.v,
    date: (cell: GVizCell) =>
      // Parse dates formatted as "Date(YYYY,MM,DD)"
      typeof cell.v !== "string"
        ? null
        : new Date(cell.v.substring(5, cell.v.length - 1)),
    datetime: (cell: GVizCell) =>
      // Parse dates formatted as "Date(YYYY,MM,DD,HH,MM,SS)"
      // typeof cell.v !== "string"
      //   ? null
      //   : new Date(cell.v.substring(5, cell.v.length - 1)),
      // Timezones make the above inaccurate, so we just return the formatted time.
      cell.f,
  };

  const parsersArray: { key: string; parser: (cell: GVizCell) => unknown }[] =
    [];
  for (const column of cols) {
    const key = mapping[column.id] ?? column.id;
    let parser = parsers[column.type];
    if (parser === undefined) {
      console.warn(
        `Unknown datatype "${column.type}"! If this isn't expected, you should open an issue.`,
      );
      // Fallback to treating the column as a string
      parser = parsers.string;
    }
    parsersArray.push({ key, parser });
  }

  return function (row: GVizRow) {
    const ret: Record<string, unknown> = {};

    for (const [idx, { key, parser }] of parsersArray.entries()) {
      const cell = row.c[idx];
      if (cell == null) {
        ret[key] = null;
        continue;
      }
      ret[key] = parser(cell);
    }

    return ret as ParsedRow<T>;
  };
}
