import fs from 'fs';

import { log2db } from './logs';

export async function imageSaver({ name, data }) {
  console.log("\n..zv save data to media in:", name, !!data);
  if (!data) return; //nothing to save
  if (data.startsWith("error:")) {
    await log2db("".concat(name), data);
    return;
  }
  const fileName = "".concat(process.env.mediaFolderAbsolutePath || '', '/', name);
  const buff = Buffer.from(data, 'base64');
  fs.writeFile(fileName, buff, async (err) => {
    if (err) await log2db("".concat(name), "error:".concat(err.message));
    await log2db("".concat(name), `${buff.length} bytes saved ok to media: ${fileName}`);
  });
  console.log("".concat(name), `${buff.length} bytes saved ok to media: ${fileName}`);
};

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

export function readFileSyncSafe(fname: string) {
  let result;
  try {
    result = fs.readFileSync(fname);
  } catch (err) {
    console.log('..zv: readFileSyncSafe error with:', fname, err?.message);
  }
  return result;
}