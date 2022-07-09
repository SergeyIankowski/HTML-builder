const path = require('path');
const { readFile, writeFile, mkdir, readdir, copyFile } = require('fs/promises');


async function findAndReplaceTemplateLinksFromComponentsFolder(filePath) {

  let templateFileText = await readFile(filePath, 'utf-8');

  const reg = /\{\{[a-z]+}}/gm;
  let linksFromTemplateText = templateFileText.match(reg);

  let templateLinksTexts = await Promise.all(linksFromTemplateText.map(template => {
    let pathForTempate = path.resolve(__dirname, 'components', `${template.slice(2, -2)}.html`);
    return readFile(pathForTempate, 'utf-8')
  }))
  for(let key = 0; key < linksFromTemplateText.length; key++) {
    templateFileText = templateFileText.replace(linksFromTemplateText[key], templateLinksTexts[key]);
  }
  return templateFileText;
}


async function mergeCssFiles(directoryPath, bundleFilePath) {
  const files = await readdir(directoryPath, { withFileTypes: true });
  
  let bundleData = '';
  for(let file of files) {
    const filePath = path.resolve(directoryPath, file.name);

    if (!file.isDirectory() && path.extname(filePath) === '.css') {

      let currentData = await readFile(filePath, 'utf-8');
      bundleData += currentData;
      
    }
  }

  let writing = await writeFile(bundleFilePath, bundleData);
}


async function copyFolder(directoryPath, destinationPath) {

  let copyDirectoryPath;
  if(!destinationPath) {
  const folderName = path.basename(directoryPath);
  const folderCopyName = folderName + '-copy';
  copyDirectoryPath = path.resolve(__dirname, folderCopyName);
  } else {
    copyDirectoryPath = destinationPath;
  }


  mkdir(copyDirectoryPath, {recursive: true});
  const files = await readdir(directoryPath, { withFileTypes: true });

  files.forEach(item => {

    if(item.isDirectory()) {

      copyFolder(path.resolve(directoryPath, item.name), path.resolve(copyDirectoryPath, item.name));

    } else {

      const currentPath = path.resolve(directoryPath, item.name);
      const destPath = path.resolve(copyDirectoryPath, item.name)
      copyFile(currentPath, destPath);
      
    }

  })

}

async function bundleToDist(pathToDist) {
  const indexHtmlData = await findAndReplaceTemplateLinksFromComponentsFolder(path.resolve(__dirname, 'template.html'));
  const mkDirPromise = await mkdir(pathToDist, {recursive: true});
  const promise = await writeFile(path.resolve(pathToDist, 'index.html'), indexHtmlData);

  const cssBundlePromise = await mergeCssFiles(path.resolve(__dirname, 'styles'), path.resolve(pathToDist, 'style.css'));
  const copyAssetsToBundle = await copyFolder(path.resolve(__dirname, 'assets'), path.resolve(__dirname, 'project-dist/assets'));
  
}

bundleToDist(path.resolve(__dirname, 'project-dist'));

