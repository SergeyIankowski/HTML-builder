const { readdir, mkdir, copyFile, rm, } = require("fs/promises");
const path = require("path");

async function copyFolder(directoryPath, destinationPath) {

  let copyDirectoryPath;
  if (!destinationPath) {
    const folderName = path.basename(directoryPath);
    const folderCopyName = folderName + "-copy";
    copyDirectoryPath = path.resolve(__dirname, folderCopyName);
  } else {
    copyDirectoryPath = destinationPath;
  }

  // try to read copied directory. If directory is exist, delete it and start copy func recursively
  let isDir = false;
  try {
    let files = await readdir(copyDirectoryPath, { withFileTypes: true });
    isDir = files;
  } catch (e) {
    isDir = false;
  }
  if (isDir) {
    await rm(copyDirectoryPath, { recursive: true });
    await copyFolder(directoryPath, copyDirectoryPath);
    return;
  }

  // if directory doesn't exist simply copy it
  await mkdir(copyDirectoryPath, { recursive: true });
  const files = await readdir(directoryPath, { withFileTypes: true });

  files.forEach(item => {

    if (item.isDirectory()) {

      copyFolder(path.resolve(directoryPath, item.name), path.resolve(copyDirectoryPath, item.name));

    } else {

      const currentPath = path.resolve(directoryPath, item.name);
      const destPath = path.resolve(copyDirectoryPath, item.name);
      copyFile(currentPath, destPath);

    }

  });

}

copyFolder(path.resolve(__dirname, "files"));
