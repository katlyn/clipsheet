/**
 * Return the path to the file(s) that should be covered by the given test file.
 * @param {string} testFile
 * @returns {string}
 */
export default (testFile) => testFile.replace(/^test/, "src");
