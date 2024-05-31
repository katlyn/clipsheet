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
  v: string | number | null | boolean;
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
