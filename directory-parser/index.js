#!/usr/bin/env node

/* Studio Webux S.E.N.C 2022 */

const fs = require("fs");
const path = require("path");

let finalHierarchy = {
  baseDir: process.cwd(),
};

function recursiveHierarchy(currentPath) {
  return new Promise(async (resolve) => {
    // console.log(currentPath)
    const dirs = fs.readdirSync(path.resolve(currentPath));
    const currentStripedPath = currentPath.split(process.cwd())[1];
    finalHierarchy[currentStripedPath] = [];

    for await (dir of dirs) {
      const cDir = path.resolve(currentPath, dir);
      // console.log(cDir)
      if (fs.statSync(cDir).isDirectory()) {
        await recursiveHierarchy(cDir, finalHierarchy[currentStripedPath]);
      } else {
        if (!dir.includes(".DS_Store")) {
          finalHierarchy[currentStripedPath].push(dir);
        }
      }
    }

    return resolve(currentPath);
  });
}

(async () => {
  await recursiveHierarchy(process.cwd());
  fs.writeFileSync("hierarchy.json", JSON.stringify(finalHierarchy));
  console.log("hierarchy saved !");
})();
