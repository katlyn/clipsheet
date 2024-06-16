import t from "tap";
import extractSheetDetails from "../src/urls.ts";

const KEY = "17bl4YIU6MYxjdQro91eInFrRAPzpTORBsL8p5mKelSI";
const GID = "1134538697";

t.test("extractSheetDetails", async (t) => {
  t.test("2010 format URL", async (t) => {
    const { key, gid } = extractSheetDetails(
      `https://docs.google.com/spreadsheet/ccc?key=${KEY}#gid=${GID}`,
    );
    t.equal(key, KEY);
    t.equal(gid, GID);
  });

  t.test("2014 format URL", async (t) => {
    const { key, gid } = extractSheetDetails(
      `https://docs.google.com/spreadsheets/d/${KEY}/edit#gid=${GID}`,
    );
    t.equal(key, KEY);
    t.equal(gid, GID);
  });

  t.throws(() => extractSheetDetails("invalid url"));
});
