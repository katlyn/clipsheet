import t from "tap";
import querystring from "querystring";

import { MockAgent, setGlobalDispatcher } from "undici";
import { queryGViz } from "../src/gviz.js";

const mockAgent = new MockAgent();
mockAgent.disableNetConnect();
setGlobalDispatcher(mockAgent);

const mockPool = mockAgent.get("https://docs.google.com");

function testGvisUrl(
  key: string,
  gid: string,
  query: string,
): (path: string) => boolean {
  const expectedPath = `/spreadsheets/d/${key}/gviz/tq`;
  const expectedQuery = { gid, tq: query };
  return function (url: string): boolean {
    const [path, rawQuery] = url.split("?");
    const query = querystring.parse(rawQuery);

    return (
      path === expectedPath &&
      Object.entries(expectedQuery).every(([k, v]) => query[k] === v)
    );
  };
}

t.test("successful fetch with valid return data", async (t) => {
  const key = "key1234567890AbCdEfG";
  const gid = "gid1234567890AbCdEfG";
  const query = "SELECT A, B, C";
  mockPool
    .intercept({
      path: testGvisUrl(key, gid, query),
    })
    .reply(
      200,
      `/*O_o*/
google.visualization.Query.setResponse({"version":"0.6","reqId":"0","status":"ok","sig":"1631881516","table":{"cols":[{"id":"A","label":"","type":"string"},{"id":"B","label":"","type":"number","pattern":"General"},{"id":"C","label":"","type":"string"}],"rows":[{"c":[{"v":"This is a string"},{"v":123456.0,"f":"123456"},{"v":"https://katlyn.dev/"}]},{"c":[{"v":"Another"},{"v":823948.0,"f":"823948"},{"v":"https://google.com"}]},{"c":[{"v":"234234"},null,{"v":"ww345"}]}],"parsedNumHeaders":0}});`,
    );

  let sheetData;
  await t.resolves(async () => {
    sheetData = await queryGViz(key, gid, query);
  }, "fetch and return valid data without error");
  t.ok(sheetData);
});

t.test("successful fetch with error return data", async (t) => {
  const key = "key1234567890AbCdEfG";
  const gid = "gid1234567890AbCdEfG";
  const query = "ERROR A, B, C";
  mockPool
    .intercept({
      path: testGvisUrl(key, gid, query),
    })
    .reply(
      200,
      `/*O_o*/
google.visualization.Query.setResponse({"version":"0.6","reqId":"0","status":"error","errors":[{"reason":"invalid_query","message":"INVALID_QUERY","detailed_message":"Invalid query: PARSE_ERROR: Encountered \\u0022 \\u003cID\\u003e \\u0022SELECbT \\u0022\\u0022 at line 1, column 1.\\nWas expecting one of:\\n    \\u003cEOF\\u003e \\n    \\u0022select\\u0022 ...\\n    \\u0022where\\u0022 ...\\n    \\u0022group\\u0022 ...\\n    \\u0022pivot\\u0022 ...\\n    \\u0022order\\u0022 ...\\n    \\u0022skipping\\u0022 ...\\n    \\u0022limit\\u0022 ...\\n    \\u0022offset\\u0022 ...\\n    \\u0022label\\u0022 ...\\n    \\u0022format\\u0022 ...\\n    \\u0022options\\u0022 ...\\n    "}]});`,
    );

  await t.rejects(async () => {
    await queryGViz(key, gid, query);
  }, "fetch and return valid data without error");
});

t.test("successful fetch with invalid return data", async (t) => {
  const key = "key1234567890AbCdEfG";
  const gid = "gid1234567890AbCdEfG";
  const query = "INVALID RETURN";
  mockPool
    .intercept({
      path: testGvisUrl(key, gid, query),
    })
    .reply(200, `/*O_o*/`);

  await t.rejects(async () => {
    await queryGViz(key, gid, query);
  }, "fetch and return valid data without error");
});

t.test("successful fetch with invalid return data", async (t) => {
  const key = "key1234567890AbCdEfG";
  const gid = "gid1234567890AbCdEfG";
  const query = "NOT OKAY RETURN";
  mockPool
    .intercept({
      path: testGvisUrl(key, gid, query),
    })
    .reply(400, `/*O_o*/`);

  await t.rejects(async () => {
    await queryGViz(key, gid, query);
  }, "fetch and return valid data without error");
});
