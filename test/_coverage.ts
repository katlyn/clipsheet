// This file is a stub intended to include all files for test coverage.
import { glob } from "glob";

for (const file of await glob("src/**/*.ts")) {
  import(`../${file}`);
}
