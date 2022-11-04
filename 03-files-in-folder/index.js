const { readdir } = require("fs/promises");
const { stat } = require("fs");
const path = require("path");


async function getFileNames(pathToFiles) {
  try {

    const files = await readdir(pathToFiles, { withFileTypes: true });

    files.forEach(file => {

      const currentPath = path.resolve(pathToFiles, file.name);

      stat(currentPath, (error, stats) => {
        if (error) console.error(error.message);

        if (!stats.isDirectory()) {
          const extname = path.extname(currentPath);
          const basename = path.basename(currentPath, extname);
          const size = stats.size;
          console.log(`${basename} - ${extname.slice(1)} - ${(size / 1024).toFixed(2) + "kB"}`);
        }
      });

    });


  } catch (err) {
    console.log(err.message);
  }
}

getFileNames(path.resolve(__dirname, "secret-folder"));
