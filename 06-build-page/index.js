const path = require("path");
const { readFile, writeFile, mkdir, readdir, copyFile } = require("fs/promises");


async function findAndReplaceTemplateLinksFromComponentsFolder(filePath) {
  // read template file
  let templateFileText = await readFile(filePath, "utf-8");

  // find nested components links
  const reg = /\{\{[a-z]+}}/gm;
  let linksFromTemplateText = templateFileText.match(reg);

  // read and prepare text from components files
  let templateLinksTexts = await Promise.all(linksFromTemplateText.map(template => {

    let pathForTempate = path.resolve(__dirname, "components", `${template.slice(2, -2)}.html`);
    return readFile(pathForTempate, "utf-8");

  }));

  // replace nested links 
  for (let key = 0; key < linksFromTemplateText.length; key++) {

    templateFileText = templateFileText.replace(linksFromTemplateText[key], templateLinksTexts[key]);

  }

  return templateFileText;

}


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


async function copyFolder(directoryPath, destinationPath) {

  let copyDirectoryPath;

  // create new directory if it isn't defined
  if (!destinationPath) {

    const folderName = path.basename(directoryPath);
    const folderCopyName = folderName + "-copy";
    copyDirectoryPath = path.resolve(__dirname, folderCopyName);

  } else {

    copyDirectoryPath = destinationPath;

  }


  mkdir(copyDirectoryPath, { recursive: true });
  const files = await readdir(directoryPath, { withFileTypes: true });

  files.forEach(item => {

    if (item.isDirectory()) {

      // if item is directory then going down inside recursively
      copyFolder(path.resolve(directoryPath, item.name), path.resolve(copyDirectoryPath, item.name));

    } else {

      // if item is file, copy this file to destination directory
      const currentPath = path.resolve(directoryPath, item.name);
      const destPath = path.resolve(copyDirectoryPath, item.name);
      copyFile(currentPath, destPath);

    }

  });

}

async function bundleToDist(pathToDist) {
  const indexHtmlData = await findAndReplaceTemplateLinksFromComponentsFolder(path.resolve(__dirname, "template.html")); // compile all html files to one
  await mkdir(pathToDist, { recursive: true });
  await writeFile(path.resolve(pathToDist, "index.html"), indexHtmlData); // create destination html file

  await mergeAndPasteCssFiles(path.resolve(__dirname, "styles"), path.resolve(pathToDist, "style.css")); // compile css files to one dist file
  await copyFolder(path.resolve(__dirname, "assets"), path.resolve(__dirname, "project-dist/assets")); // copy asssets folder to dist folder

}

bundleToDist(path.resolve(__dirname, "project-dist"));

