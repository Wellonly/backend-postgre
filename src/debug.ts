import { decryptText, encryptText } from './utils/pkelib';

export function tests() {
//// tests...
// console.log("zv curves:", crypto.getCurves());
// availableCurvesTest(true);

// import {encryptText, decryptText} from './utils/pkelib';
// const txt = "12345678901234567890";
// const enctext = encryptText(txt,"pass");
// const dectext = decryptText(enctext, "pass");
// console.log("zv enc/dec:", enctext, dectext, txt === dectext ? "OK": "FAIL");

// getPublicKey2();

// testHell();
// const crypto = require('crypto');
// for (let i = 1; i<11; i++) {
//   const res1 = crypto.pbkdf2Sync('pass', 'salt', 100000+i, 33, 'sha256');
//   console.log("zv pbkdf:", i, res1);
// }

// const crypto = require('crypto');
// let key1 = crypto.pbkdf2Sync('pass', 'salt', 100000, 32, 'sha256');
// let key2 = crypto.pbkdf2Sync('pass', 'salt', 100000, 32, 'sha256');
// let key3 = crypto.pbkdf2Sync(key2, 'salt', 100000, 32, 'sha256');
// console.log("zv key1:", key1);
// console.log("zv key2:", key2);

  const crypt_txt = "12345678901234567890";
  const et = encryptText(crypt_txt, 'dfgh', 'ghgh', Buffer.alloc(12, 'dfgh'), 32, 'chacha20-poly1305');
  const pt = decryptText(et, 'dfgh', 'ghgh', Buffer.alloc(12, 'dfgh'), 32, 'chacha20-poly1305');
  console.log("zv en/de:", et, et?.length , pt, crypt_txt === pt);

  console.log("zv test end, isDebug:", process.env.isDebug);
}
