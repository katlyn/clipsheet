/**
 * Utilities relating to parsing sheet keys and GIDs from a given URL.
 * @module
 *
 * The contents of this module are heavily inspired and referenced from the
 * implementation in Sheetrock by Chris Zarate, licensed under the MIT license.
 * https://github.com/chriszarate/sheetrock
 */

import ClipsheetError from "./errors";

/**
 * Regexes used to extract a sheet key and GID from url.
 * https://github.com/chriszarate/sheetrock/blob/0eaf2c63fe6a88a772b954c18dcfed636887a572/src/lib/config.js#L21-L33
 */
export const urlRegexes = {
  2014: {
    keyFormat: new RegExp("spreadsheets/d/([^/#]+)", "i"),
    gidFormat: new RegExp("gid=([^/&#]+)", "i"),
  },
  2010: {
    keyFormat: new RegExp("key=([^&#]+)", "i"),
    gidFormat: new RegExp("gid=([^/&#]+)", "i"),
  },
};

type SheetDetails = { key: string; gid: string };

/**
 * Extract a sheet's key and GID from the sheet URL
 * https://github.com/chriszarate/sheetrock/blob/0eaf2c63fe6a88a772b954c18dcfed636887a572/src/lib/options.js#L45-L61
 * @param url The URL of the sheet to extract information for
 */
export default function extractSheetDetails(url: string): SheetDetails {
  for (const { keyFormat, gidFormat } of Object.values(urlRegexes)) {
    if (keyFormat.test(url) && gidFormat.test(url)) {
      // It's alright to assert these as non-null as we tested for their existence above.
      return {
        key: url.match(keyFormat)![1],
        gid: url.match(gidFormat)![1],
      };
    }
  }
  throw new ClipsheetError("Provided URL does not contain a key and gid");
}
