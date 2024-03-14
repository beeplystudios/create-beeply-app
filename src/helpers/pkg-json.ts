import fsExtra from "fs-extra";
import path from "path";

export const loadPkgJson = () => {
  globalThis.PACKAGE_JSON = fsExtra.readJSONSync(
    path.join(PROJECT_DIR, "package.json")
  );
};

export const commitPkgJson = () => {
  fsExtra.writeJSONSync(path.join(PROJECT_DIR, "package.json"), PACKAGE_JSON, {
    spaces: 2,
  });
};
