import t from "tap";
import { createRowParser } from "../src/parser.ts";

t.test("createRowParser", async (t) => {
  t.test("empty map with no columns", async (t) => {
    const parser = createRowParser({}, []);
    t.type(parser, Function, "createRowParser returns function");

    const parsed = parser({ c: [] });
    t.matchStrict(parsed, {});
  });

  t.test("empty map with columns of each type", async (t) => {
    const parser = createRowParser({}, [
      {
        id: "A",
        label: "",
        type: "string",
      },
      {
        id: "B",
        label: "",
        type: "number",
        pattern: "General",
      },
      {
        id: "C",
        label: "",
        type: "date",
        pattern: "mmmm d, yyyy",
      },
      {
        id: "D",
        label: "",
        type: "boolean",
      },
      {
        id: "E",
        label: "",
        type: "datetime",
        pattern: "h:mm",
      },
    ]);
    t.type(parser, Function, "createRowParser returns function");

    const parsed = parser({
      c: [
        {
          v: "This is a string",
        },
        {
          v: 123456.0,
          f: "123456",
        },
        {
          v: "Date(2000,7,12)",
          f: "August 12, 2000",
        },
        {
          v: true,
          f: "TRUE",
        },
        {
          v: "Date(1899,11,30,20,0,0)",
          f: "20:00",
        },
      ],
    });

    t.matchOnlyStrict(parsed, {
      A: "This is a string",
      B: 123456,
      C: new Date("2000-07-12T08:00:00.000Z"),
      D: true,
      E: "20:00",
    });
  });

  t.test("filled map with columns of each type", async (t) => {
    const parser = createRowParser({}, [
      {
        id: "A",
        label: "",
        type: "string",
      },
      {
        id: "B",
        label: "",
        type: "number",
        pattern: "General",
      },
      {
        id: "C",
        label: "",
        type: "date",
        pattern: "mmmm d, yyyy",
      },
      {
        id: "D",
        label: "",
        type: "boolean",
      },
      {
        id: "E",
        label: "",
        type: "datetime",
        pattern: "h:mm",
      },
    ]);
    t.type(parser, Function, "createRowParser returns function");

    const rows = [
      {
        c: [
          {
            v: "This is a string",
          },
          {
            v: 123456.0,
            f: "123456",
          },
          {
            v: "Date(2000,7,12)",
            f: "August 12, 2000",
          },
          {
            v: true,
            f: "TRUE",
          },
          {
            v: "Date(1899,11,30,20,0,0)",
            f: "20:00",
          },
        ],
      },
      {
        c: [{ v: null }, { v: null }, { v: null }, { v: null }, { v: null }],
      },
      {
        c: [null, null, null, null, null],
      },
    ];

    t.doesNotThrow(
      () => rows.map(parser),
      "nullable values handled gracefully",
    );
  });

  t.test("filled map with no columns", async (t) => {
    const parser = createRowParser(
      {
        A: "fieldOne",
        B: "fieldTwo",
      } as const,
      [],
    );
    t.type(parser, Function, "createRowParser returns function");

    const parsed = parser({ c: [] });

    parsed.fieldOne;
    t.matchStrict(parsed, {});
  });

  t.test("empty map with column of unknown type", async (t) => {
    const parser = createRowParser({}, [
      {
        id: "A",
        label: "",
        // @ts-expect-error specify a type that we don't yet support
        type: "fake-type",
      },
    ]);
    t.type(parser, Function, "createRowParser returns function");

    const parsed = parser({ c: [{ v: "fake-val" }] });
    t.matchOnlyStrict(parsed, { A: "fake-val" });
  });
});
