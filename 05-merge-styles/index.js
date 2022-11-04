const path = require("path");
const { readdir, readFile, writeFile } = require("fs/promises");

async function mergeAndPasteCssFiles(directoryPath, bundleFilePath) {
  const files = await readdir(directoryPath, { withFileTypes: true });

  let bundleData = "";
  for (let file of files) {
    const filePath = path.resolve(directoryPath, file.name);

    if (!file.isDirectory() && path.extname(filePath) === ".css") {

      let currentData = await readFile(filePath, "utf-8");
      bundleData += currentData;

    }
  }

  await writeFile(bundleFilePath, bundleData);
}

mergeAndPasteCssFiles(path.resolve(__dirname, "styles"), path.resolve(__dirname, "project-dist/bundle.css"));
