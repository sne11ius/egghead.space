const fs = require("fs");
const path = require("path");

const apiPath = path.join(__dirname, "apis");

fs.readdirSync(apiPath, files => {
  files.forEach(file => {
    const apiForFile = require(path.join(apiPath, file));
    Object.assign(exports, apiForFile);
  });
});
