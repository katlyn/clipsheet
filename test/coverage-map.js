/**
 * Return the path to the file(s) that should be covered by the given test file.
 * @param {string} path
 * @returns {string|string[]|null}
 */
export default (path) => {
  if (path.endsWith("_coverage.ts")) {
    return [];
  }
  return path.replace(/^test/, "src");
};
