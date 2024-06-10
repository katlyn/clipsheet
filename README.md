# Clipsheet

Clipsheet allows you to easily pull data from public Google Sheets workbooks for use in displaying on websites,
processing data, or otherwise. It uses Google's GViz API to query data, and transforms the resulting data into an
easy-to-use array. Queries are written with the GViz
[Query Language](https://developers.google.com/chart/interactive/docs/querylanguage), allowing you to manipulate and
transform data before processing. It is a spiritual successor to
[sheetrock.js](https://chriszarate.github.io/sheetrock/), using modern JS features and without a dependency on jQuery.


## Usage

Clipsheet is packaged and released on [JSR](https://jsr.io/), and is compatible with all Javascript runtimes using
ESModules. See JSR's documentaiton for information on how to
[install a JSR package](https://jsr.io/docs/using-packages). In the browser, [esm.sh](https://esm.sh/) can be used to
link the library.


### Example

The following code fetches all data from a sheet and embeds it on a webpage as an HTML table. The majority of this
code  is required to generate the table—all that is needed to fetch data is the one call to `clipsheet`.

```js
import clipsheet from "https://esm.sh/jsr/@katlyn/clipsheet";
const data = await clipsheet(
  "17bl4YIU6MYxjdQro91eInFrRAPzpTORBsL8p5mKelSI",
  "1134538697",
  "SELECT A,B,C"
);

const table = document.createElement("table");

// Generate the column headers based on the first element in the response
const thead = document.createElement("thead");
const theadr = document.createElement("tr")
const cols = Object.keys(data[0])
for (const col of cols) {
  const th = document.createElement("th")
  th.innerText = col
  theadr.appendChild(th)
}
thead.appendChild(theadr)
table.appendChild(thead)

// Generate all rows
const tbody = document.createElement("tbody");
for (const row of data) {
  const tr = document.createElement("tr")
  for (const col of cols) {
    const td = document.createElement("td")
    td.innerText = row[col]
    tr.appendChild(td)
  }
  tbody.appendChild(tr)
}
table.appendChild(tbody)

// Add the table to the document
document.body.appendChild(table)
```


## Documentation
Documentation is available on [JSR](https://jsr.io/@katlyn/clipsheet/docs).
