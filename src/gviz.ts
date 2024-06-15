/**
 * Provides utilities and types for use when querying the GViz API.
 * @module
 */

import ClipsheetError from "./errors";

/** Represents a generic response from the GViz API */
interface BaseGVizResponse {
  version: string;
  reqId: string;
  status: string;
}

type GVizResponse = GVizErrorResponse | GVizQueryResponse;

/** An error response from the GViz API */
export interface GVizErrorResponse extends BaseGVizResponse {
  status: "error";
  errors: GVizError[];
}

/** A successful response from the GViz API */
export interface GVizQueryResponse extends BaseGVizResponse {
  status: "ok";
  sig: string;
  table: GVizTable;
}

/** Represents a singular error in a GVizErrorResponse */
export interface GVizError {
  reason: string;
  message: string;
  detailed_message: string;
}

/** The representation of a full table from the GViz API */
export interface GVizTable {
  cols: GVizCol[];
  rows: GVizRow[];
  parsedNumHeaders: number;
}

/** Represents a column definition */
export interface GVizCol {
  id: string;
  label: string;
  type: "string" | "number" | "date" | "datetime" | "boolean";
  pattern?: string;
}

/** Represents a row in a GVizTable */
export interface GVizRow {
  c: (GVizCell | null)[];
}

/** Represents a cell in a GVizRow */
export interface GVizCell {
  v: string | number | null | boolean;
  f?: string;
}

const QUERY_URL_TEMPLATE = "https://docs.google.com/spreadsheets/d/KEY/gviz/tq";

/** Error thrown when the request to the GViz API fails */
export class GVizRequestError extends ClipsheetError {}

/** Error thrown if the GViz API returns an error (e.g., when a malformed query is provided) */
export class GVizQueryError extends GVizRequestError {
  declare data: GVizErrorResponse;
  constructor(data: GVizErrorResponse) {
    super("Error querying the GViz API");
    this.data = data;
  }
}

/**
 * Fetch data from the GViz API, wrapping errors in easily catchable classes. Extracts the useful JSON from the
 * response, without executing any remote code.
 * @param key Spreadsheet key
 * @param gid Spreadsheet GID
 * @param query The GViz query to execute. Leave blank to return all content in the sheet
 */
export async function queryGViz(
  key: string,
  gid: string,
  query: string = "",
): Promise<GVizQueryResponse> {
  const queryUrl = new URL(QUERY_URL_TEMPLATE.replace("KEY", key));
  queryUrl.searchParams.set("gid", gid);
  queryUrl.searchParams.set("tq", query);

  const response = await fetch(queryUrl);

  if (!response.ok) {
    throw new GVizRequestError(await response.text());
  }

  const callbackString = await response.text();
  const rawResult = callbackString.substring(
    callbackString.indexOf("(") + 1,
    callbackString.lastIndexOf(")"),
  );

  let parsed: GVizResponse;

  try {
    parsed = JSON.parse(rawResult);
  } catch (err) {
    throw new GVizRequestError(`Unable to parse response data: ${err}`);
  }

  if (parsed.status === "error") {
    throw new GVizQueryError(parsed);
  }

  return parsed;
}
