const { stdin, stdout, exit } = process;
const path = require("path");
const fs = require("fs");

stdout.write("write your text below\n");
stdin.on("data", data => {

  fs.readFile(path.resolve(__dirname, "text.txt"), "utf-8", (error, content) => {
    if (error) console.error("not file in the directory, create new text.txt file");

    let fileContent = content;
    if (fileContent === undefined) {
      fileContent = data;
    } else {
      fileContent += data;
    }
    fs.writeFile(path.resolve(__dirname, "text.txt"), fileContent, err => {
      if (err) console.error(err.message);
      console.log("text is written in file");
      exit();
    });
  });

});

process.on("SIGINT", () => {
  stdout.write("\ngood bye!\n");
  exit();
});