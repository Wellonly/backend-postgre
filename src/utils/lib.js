const { log2db } = require('./logs');

const fs = require('fs');

const imageSaver = async ({ name, data }) => {
  console.log("zv save data to media in:", name, !!data);
  if (!data) return; //nothing to save
  if (data.startsWith("error:")) {
    await log2db("".concat(name), data);
    return;
  }
  const fileName = "".concat(process.env.mediaFolderAbsolutePath, '/', name);
  const buff = Buffer.from(data, 'base64');
  fs.writeFile(fileName, buff, async (err) => {
    if (err) await log2db("".concat(name), "error:".concat(err.message));
    await log2db("".concat(name), `${buff.length} bytes saved ok to media: ${fileName}`);
  });
  console.log("".concat(name), `${buff.length} bytes saved ok to media: ${fileName}`);
};
module.exports.imageSaver = imageSaver;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   
module.exports.sleep = sleep;