import t from "tap";

import * as gviz from "../src/gviz.ts";

const KEY = "17bl4YIU6MYxjdQro91eInFrRAPzpTORBsL8p5mKelSI";
const GID = "1134538697";

const { fetchSheet, fetchSheetFromUrl } = await t.mockImport<
  typeof import("../src/index.ts")
>("../src/index.ts", {
  "../src/gviz.ts": t.createMock(gviz, {
    queryGViz: async () => ({
      version: "0.6",
      reqId: "0",
      status: "ok",
      sig: "1631881516",
      table: {
        cols: [
          { id: "A", label: "", type: "string" },
          { id: "B", label: "", type: "number", pattern: "General" },
          { id: "C", label: "", type: "string" },
        ],
        rows: [
          {
            c: [
              { v: "This is a string" },
              { v: 123456.0, f: "123456" },
              { v: "https://katlyn.dev/" },
            ],
          },
          {
            c: [
              { v: "Another" },
              { v: 823948.0, f: "823948" },
              { v: "https://google.com" },
            ],
          },
          { c: [{ v: "234234" }, null, { v: "ww345" }] },
        ],
        parsedNumHeaders: 0,
      },
    }),
  }),
});

t.test("fetchSheet", async (t) => {
  const ret = await fetchSheet(KEY, GID);
  t.ok(ret);
});

t.test("fetchSheetFromUrl", async (t) => {
  const ret = await fetchSheetFromUrl(
    `https://docs.google.com/spreadsheets/d/${KEY}/edit#gid=${GID}`,
  );
  t.ok(ret);
});
