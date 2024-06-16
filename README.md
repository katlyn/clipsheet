# Clipsheet

Clipsheet allows you to easily pull data from public Google Sheets workbooks for use in displaying on websites,
processing data, or otherwise. It uses Google's GViz API to query data, and transforms the resulting data into an
easy-to-use array. Queries are written with the [Google Visualization Query Language][gql], allowing you to manipulate
and transform data before processing. It is a spiritual successor to [sheetrock.js][sheetrock], using modern JS
features.

## Usage

Clipsheet is packaged and released on [JSR](https://jsr.io/), and is compatible with all Javascript runtimes using
ESModules. See JSR's documentaiton for information on how to
[install a JSR package](https://jsr.io/docs/using-packages). In the browser, [esm.sh](https://esm.sh/) can be used to
import the library.

To use the Clipsheet, simply import it and pass a sheet URL and optionally your query.

```js
import clipsheet from "https://esm.sh/jsr/@katlyn/clipsheet";

// Omitting the query returns all data in the table
const data = await clipsheet(
  "https://docs.google.com/spreadsheets/d/17bl4YIU6MYxjdQro91eInFrRAPzpTORBsL8p5mKelSI/edit?gid=1949848317#gid=1949848317",
);
console.log(data[0]); // { "A": "Colorado Macias", B: "urna@hotmail.edu", ...}

// You can provide a sheet's key and gid manually if you'd like
import { fetchSheet } from "https://esm.sh/jsr/@katlyn/clipsheet";
await fetchSheet("17bl4YIU6MYxjdQro91eInFrRAPzpTORBsL8p5mKelSI", "1949848317");

// To make returned rows easier to handle, provide a column mapping to use nicer keys
const directory = await fetchSheet(
  "17bl4YIU6MYxjdQro91eInFrRAPzpTORBsL8p5mKelSI",
  "1949848317",
  "SELECT A, B, C, D, E",
  {
    A: "name",
    B: "email",
    C: "phone",
    D: "company",
    E: "birthdate",
  },
);
console.log(directory[0]); // { name: "Colorado Macias", email: "urna@hotmail.edu", ... }
```
> ![NOTE]
> Individual modules are available for consumption as well, in case you want to integrate more tightly with the data
> returned by the GViz API. See the [documentation][documentation] for the available modules.

### Notes on spreadsheet formatting and requirements

Clipsheet is only able to query information from public Google Sheets. Sheets _must_ be public to be able to
pull data from them. If the information you want to access is sensitive,
[google-spreadsheet](https://www.npmjs.com/package/google-spreadsheet) may be a better fit for your use case.
Additionally, the GViz API makes some assumptions about how your spreadsheets will be formatted—it will count any row
above the first row with a non-string cell as a header row and may not include it in the response. Additionally,
if there are no non-string cells in the sheet, all rows (including any possible header rows) will be returned.

> [!TIP]
> If you are having issues with the correct rows not being returned, try creating a new column that includes an integer
> on the first row of non-column data. See
> [this sheet](https://docs.google.com/spreadsheets/d/17bl4YIU6MYxjdQro91eInFrRAPzpTORBsL8p5mKelSI/edit?gid=1236731650#gid=1236731650)
> for an example. Note that depending on your query, this may result in additional data being returned.

> [!WARNING]
> Unless you provide a limit in your query, Clipsheet will attempt to query as many rows as the GViz API will return.
> This may include any blank rows that create a gap between other filled rows.

If you are providing a URL to Clipsheet, the URL must contain both the sheet key and GID. Sheet sharing links will not
work correctly. To get a compatible URL, view the sheet you want to query and copy your browser's current URL.

### Examples

#### Populate HTML table

The following example populates a table within a page with data from the queried spreadsheet.
[View on Codepen](https://codepen.io/katlyn/pen/KKLvEdj?editors=0010).

```js
import clipsheet from "https://esm.sh/jsr/@katlyn/clipsheet";

const data = await clipsheet(
  "https://docs.google.com/spreadsheets/d/17bl4YIU6MYxjdQro91eInFrRAPzpTORBsL8p5mKelSI/edit#gid=933278534",
  "SELECT A, B, C, D, E, I",
  {
    A: "No.",
    B: "Departure",
    C: "Arrival",
    D: "Train No. / Name",
    E: "Operator",
    I: "Length (hours)",
  },
);

// Create a table and populate it with the resulting data
const table = document.createElement("table");
const caption = document.createElement("caption");
caption.innerText = "Longest Train Routes";
table.appendChild(caption);

// Generate the column headers based on the first element in the response
const thead = document.createElement("thead");
const theadr = document.createElement("tr");
const cols = Object.keys(data[0]);
for (const col of cols) {
  const th = document.createElement("th");
  th.innerText = col;
  th.scope = "col";
  theadr.appendChild(th);
}
thead.appendChild(theadr);
table.appendChild(thead);

// Generate all rows
const tbody = document.createElement("tbody");
for (const row of data) {
  const tr = document.createElement("tr");
  for (const col of cols) {
    const td = document.createElement("td");
    td.innerText = row[col];
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
}
table.appendChild(tbody);

// Add the table to the document
document.body.appendChild(table);
```

## Documentation

Documentation is available on [JSR][documentation].

# Credits

Clipsheet is created by [katlyn](https://katlyn.dev/), with heavy inspiration from +

<!-- Reference links -->

[documentation]: https://jsr.io/@katlyn/clipsheet/doc
[gql]: https://developers.google.com/chart/interactive/docs/querylanguage
[sheetrock]: https://chriszarate.github.io/sheetrock/
