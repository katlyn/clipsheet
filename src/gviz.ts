export interface BaseGVizResponse {
  version: string;
  reqId: string;
  status: string;
}

type GVizResponse = GVizErrorResponse | GVizQueryResponse;

export interface GVizErrorResponse extends BaseGVizResponse {
  status: "error";
  errors: GVizError[];
}

export interface GVizQueryResponse extends BaseGVizResponse {
  status: "ok";
  sig: string;
  table: GVizTable;
}

export interface GVizError {
  reason: string;
  message: string;
  detailed_message: string;
}

export interface GVizTable {
  cols: GVizCol[];
  rows: GVizRow[];
  parsedNumHeaders: number;
}

export interface GVizCol {
  id: string;
  label: string;
  type: "string" | "number" | "date" | "datetime" | "boolean";
  pattern?: string;
}

export interface GVizRow {
  c: (GVizCell | null)[];
}

export interface GVizCell {
  v: string | number | null;
  f?: string;
}

const QUERY_URL_TEMPLATE = "https://docs.google.com/spreadsheets/d/KEY/gviz/tq";

export class GVizRequestError extends Error {}

export class GVizQueryError extends GVizRequestError {
  declare data: GVizErrorResponse;
  constructor(data: GVizErrorResponse) {
    super("Error querying the GViz API");
    this.data = data;
  }
}

export async function queryGViz(
  key: string,
  gid: string,
  query: string,
): Promise<GVizQueryResponse> {
  const queryUrl = new URL(QUERY_URL_TEMPLATE.replace("KEY", key));
  queryUrl.searchParams.set("gid", gid);
  queryUrl.searchParams.set("tq", query);
  // Append a JS function of known length, so we can tear out the JSON easily
  queryUrl.searchParams.set("tqx", "responseHandler:remove");

  const response = await fetch(queryUrl);

  if (!response.ok) {
    throw new GVizRequestError(await response.text());
  }

  const callbackString = await response.text();
  const rawResult = callbackString.substring(15, callbackString.length - 2);
  const parsed: GVizResponse = JSON.parse(rawResult);

  if (parsed.status === "error") {
    throw new GVizQueryError(parsed);
  }

  return parsed;
}
