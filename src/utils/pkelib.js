
import ms from 'ms';
import { pbkdf2Sync, createCipheriv, createDecipheriv, createECDH, randomFillSync, getCurves, CipherCCMTypes } from 'crypto';

// const curves = ['secp521r1', 'secp256k1', 'brainpoolP512t1', 'sect571k1', 'prime256v1', 'c2pnb272w1', 'brainpoolP256t1', 'SM2'];
// const crypta = ['sha256', 'sha512'];

const curve = process.env.REACT_APP_ECDH || 'secp256k1'; //secp521r1
const calgo = process.env.REACT_APP_PKE_ALGO || 'sha256';
const saltlength = Number.parseInt(process.env.REACT_APP_SALT_LENGTH || '32', 10);

const clientServerPubs = new Map(); // let serverPub = [];// let clientPub = [];

export function removePub(id) {
  return clientServerPubs.delete(id);
};

export function  salt2iterations(salt, notless = 9999, parse = 4, radix = 16) {
  const iterations = Number.parseInt(salt.substring(0, parse), radix);
  return iterations > notless ? iterations: notless;
};

// type CipherCCMTypes = "aes-128-ccm" | "aes-192-ccm" | "aes-256-ccm" | "chacha20-poly1305";

// WARN: may throw exceptions...
export function encryptText(text, pass, salt = "withoutsalt", iv = Buffer.alloc(16, pass), keylen = 24, alg = 'aes-192-cbc') { //zvv ts ignored: 'aes-192-cbc'; aes-256-cbc 'aes-192-cbc' 'chacha20-poly1305'
  let key = pbkdf2Sync(pass, salt, salt2iterations(salt), keylen, calgo); // const key = Buffer.alloc(keylen, pass);
  // console.log("zv encryptText(key, iv):", key, iv);
  // const cipher = crypto.createCipheriv(alg, key, iv); // aes-256-cbc:iv:16
  const cipher = createCipheriv(alg, key, iv,{ authTagLength: 16}); //chacha20:iv:12:authTagLength: 4, 6, 8, 10, 12, 14 or 16 bytes
  let encrypted = cipher.update("".concat(key.toString('hex').substring(keylen,keylen*2),text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  pass = ""; text = ""; if (pass !== text) return null;
  return encrypted;
};

// WARN: may throw exceptions...
export function decryptText(ctext, pass, salt = "withoutsalt", iv = Buffer.alloc(16, pass), keylen = 24, alg = 'aes-192-cbc') { //zvv ts ignored: 'aes-192-cbc'; aes-256-cbc 'aes-192-cbc' 'chacha20-poly1305'
  let key = pbkdf2Sync(pass, salt, salt2iterations(salt), keylen, calgo); // const key = Buffer.alloc(keylen, pass);
  pass = ""; if (pass !== "") return null;
  // console.log("zv encryptText(key, iv):", key, iv);
  // const decipher = crypto.createDecipheriv(alg, key, iv); // aes-256-cbc:iv:16
  const decipher = createDecipheriv(alg, key, iv, { authTagLength: 16}); //chacha20:iv:12:authTagLength: 4, 6, 8, 10, 12, 14 or 16 bytes
  let decrypted = decipher.update(ctext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted.substring(keylen);
};

export function getPublicKey(hashAlg = curve) {
  const alice = createECDH(hashAlg); //try: curves[]
  const aliceKey = alice.generateKeys().toString('hex'); //same:  const pkey = alice.getPublicKey('hex');
  clientServerPubs.set(aliceKey, alice);
  // console.log("zv PublicKey:", aliceKey);
  return aliceKey;
};

export function encryptTextByPubKeys(text, intPKey, extPKey, salt = "withoutsalt") {
  if (!intPKey || !extPKey) return null;
  const encryptor = clientServerPubs.get(intPKey); //.substring(0,32)
  if (!encryptor) {
    console.log("\n..zv encryptTextByPubKeys error:", "encryptor not found");
    return null;
  }
  try {
    const secret = encryptor.computeSecret(extPKey, 'hex');
    return encryptText(text, secret, salt);
  } catch (e) { //ecdh.computeSecret will throw an ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY error when otherPublicKey lies outside of the elliptic curve. Since otherPublicKey is usually supplied from a remote user over an insecure network, its recommended for developers to handle this exception accordingly.
    console.log("\n..zv encryptTextByPubKeys error:", e.message);
    return null;
  }
};

export function decryptTextByPubKeys(text, intPKey, extPKey, salt = "withoutsalt") {
  if (!intPKey || !extPKey) return null;
  const encryptor = clientServerPubs.get(intPKey); /*.substring(0,32)*/
  if (!encryptor) {
      console.log("zv decryptTextByPubKeys error:", "encryptor not found");
      return null;
  }
  try {
    const secret = encryptor.computeSecret(extPKey, 'hex');
    return decryptText(text, secret, salt);
  } catch (e) { //ecdh.computeSecret will throw an ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY error when otherPublicKey lies outside of the elliptic curve. Since otherPublicKey is usually supplied from a remote user over an insecure network, its recommended for developers to handle this exception accordingly.
    console.log("zv decryptTextByPubKeys error:", e.message);
    return null;
  }
};

export function pkeAlgo() { return calgo; }

export function pkeSaltLength() { return saltlength; }

//returns min 2bytes hex string
export function getRandomHexString(size) {
  const buf = Buffer.alloc(Math.max(1,size/2),(Date.now()%10000).toString(16));
  return randomFillSync(buf).toString('hex');
};

export function expire_mS(time, iat = Date.now()) {
    if (typeof time === 'string') {
      const milliseconds = ms(time);
      if (typeof milliseconds === 'undefined') {
        return 0;
      }
      return iat + milliseconds;
    } else if (typeof time === 'number') {
      return iat + time;
    }
    return 0;
};

export function availableCurvesTest(isArr) {
  const curves = getCurves();
  let outArr;
  if (isArr) {
    outArr = [];
  }
  curves.forEach((curve) => {
    try {
      const key = getPublicKey(curve);
      console.log("zv key for curve:", curve, key);
      if (isArr) outArr.push(curve);
    } catch (e) {
      console.log("zv error key for curve:", curve, e.message);
    }
  });
  if (isArr) {
    console.log("zv available curves array:", outArr);
  }
};

export function test_pbkdf() {
  const crypto = require('crypto');
  for (let i = 1; i<11; i++) {
    const res1 = crypto.pbkdf2Sync('pass', 'salt', 100000+i, 33, calgo);
    console.log("zv pbkdf:", i, res1);
  }
};

export function testHell() {
  const alisaText = "1234567890";

  const alisaPkey = getPublicKey();
  const boberPkey = getPublicKey();

  const alisaEncrypedText = encryptTextByPubKeys(alisaText, alisaPkey, boberPkey);

  const alisaDecrypedText = decryptTextByPubKeys(alisaEncrypedText, boberPkey, alisaPkey);

  console.log("zv alisa decrypt result:", alisaEncrypedText, alisaDecrypedText, alisaText === alisaDecrypedText ? "OK": "FAIL");

// one more...
  const alisaText2 = Buffer.alloc(10, "2").toString('utf8');

  const alisaEncrypedText2 = encryptTextByPubKeys(alisaText2, alisaPkey, boberPkey);

  const alisaDecrypedText2 = decryptTextByPubKeys(alisaEncrypedText2, boberPkey, alisaPkey);

  console.log("zv alisa decrypt result2:", alisaEncrypedText2, alisaDecrypedText2, alisaText2 === alisaDecrypedText2 ? "OK": "FAIL");
};

// test...
// import {encryptText, decryptText} from './utils/pkelib';
// const txt = "12345678901234567890";
// const enctext = encryptText(txt,"pass");
// const dectext = decryptText(enctext, "pass");
// console.log("zv enc/dec:", enctext, dectext);

/* availableCurvesTest(true) result:
[
  'SM2',             'brainpoolP256t1',
  'brainpoolP320r1', 'brainpoolP320t1',
  'brainpoolP384r1', 'brainpoolP384t1',
  'brainpoolP512r1', 'brainpoolP512t1',
  'c2pnb272w1',      'c2pnb304w1',
  'c2pnb368w1',      'c2tnb359v1',
  'c2tnb431r1',      'prime256v1',
  'secp256k1',       'secp384r1',
  'secp521r1',       'sect283k1',
  'sect283r1',       'sect409k1',
  'sect409r1',       'sect571k1',
  'sect571r1'
]

* */


/* availableCurvesTest() results...
zv error key for curve: Oakley-EC2N-3 Private key is not valid for specified curve.
zv error key for curve: Oakley-EC2N-4 Private key is not valid for specified curve.
zv key for curve: SM2 04db297bb3c09fd850e8538c13562052aa3a54fbd48406b044c52c14df65b9072391df24a0094d8f83294baf8404672e3f6ca27531b09f0b0b24c0cfc9132665b5
zv error key for curve: brainpoolP160r1 Private key is not valid for specified curve.
zv error key for curve: brainpoolP160t1 Private key is not valid for specified curve.
zv error key for curve: brainpoolP192r1 Private key is not valid for specified curve.
zv error key for curve: brainpoolP192t1 Private key is not valid for specified curve.
zv error key for curve: brainpoolP224r1 Private key is not valid for specified curve.
zv error key for curve: brainpoolP224t1 Private key is not valid for specified curve.
zv error key for curve: brainpoolP256r1 Private key is not valid for specified curve.
zv key for curve: brainpoolP256t1 040dd5c02d80fe062dddd9334fc7cfef3f5691b3e7ebd5ec69ac48054d9f453bbb412f7f7f6f12eb0854378eeaa1b2d5963436c1edb2525e32aa153fc8615d7ce7
zv key for curve: brainpoolP320r1 04ab462df2842245a32180f6409c57629cea3b5ab48777edecaeaaab548affabf5693a62b3f3975f6d3dfa6c79cf8a88c3933be5986d515ecf6bdb8bdaa236d8ae17aad5b2d7d318d96f8dc9ea39dc7707
zv key for curve: brainpoolP320t1 0458fbee468b5cde00248a3de5455e39abe791253d35c4b1acd1369ec1371da9b6a84391655eb504e8b950dcffd28bf7163d1d64107f5cc9252f6f8256ca848c7a9111afbdc3f26512c116c3492824d929
zv key for curve: brainpoolP384r1 042e0d3363b1f47269e41a3539747412c50043ebcfd888ad9eda5f895236c88e288a2a30bc956013aa9498ee2138a16fb742fd036206845f1be32d9eaf6a835a138dc33683a4e43d957f5f86732782e31cead0e5fb25807f86984acf63e8b56935
zv key for curve: brainpoolP384t1 046ec507294791462cfbd78c34a80704c6a9f4a06c99f300847d7375980b3def8620157771f07ee18dfe449b6ab7b83e530a01c44bc64bc021fcbde4e1b02214b6cd4a2d0699044efce21f97ef15156e7e1e0c0bcb7661cbe54ea0838d3bf7cdfe
zv key for curve: brainpoolP512r1 043b0591e414903ffa97d0225b32c645f44a4921d659d111fd7611926030560f8f60f84fb2601be3222d6142fbcfd0140b128fdbe4ecfe4c39904ae56f97cd154881f1cc1b4dd1a753e2920ec914d3ee5aa76401b22e3db94a241a4b2113b76116f40e1ca30e4e0ad1a748487222f5a27bd4eedb55e27efb9e345a1d37659472a3
zv key for curve: brainpoolP512t1 04a28ce6d5993558c63762c9162fbcec89f5f186a881f1292e2c4607751d3a112151058c6bd9a3ccf3d2f6dd6f412807c98244dbb529fd7d8f2d10295c24095e1d5a3f983cb8fec02a724b8f2f3ba562d6999a3894eba897552379fae9f58e76fad14e1d47c466b0f19993b865a02a30e1516549a0920ae7dba536cef78744f30a
zv error key for curve: c2pnb163v1 Private key is not valid for specified curve.
zv error key for curve: c2pnb163v2 Private key is not valid for specified curve.
zv error key for curve: c2pnb163v3 Private key is not valid for specified curve.
zv error key for curve: c2pnb176v1 Private key is not valid for specified curve.
zv error key for curve: c2pnb208w1 Private key is not valid for specified curve.
zv key for curve: c2pnb272w1 0421247a38ad456f6b770f34e20c6588676f5092129e183d3e4c49f00aa3357ce3af8ecfb85d8bbb0c7b1b0ab87902d89c297733acd6b5400d2d3de4ce93f36cebc98165dd
zv key for curve: c2pnb304w1 0404a5b9b61241cb1a12f9b8e484c536ba711238c7c58d425a1d56e69c32471d39d3987bc1ee402fe76270eaf96dcf6ff21fa19fd5661357501a9b03c80a0009b250aaf93fdc83002cb1b4e34d
zv key for curve: c2pnb368w1 041e2eeec1f64b1066136056130118446ab47dcf5e1c7e4fcc4fcfe44fac60d2d0d6371e49bd32b17ce7498c7061405470adb8b53bd67a62ac80296343107080209f35a6380a535fa0bbd4b95c9826861db1b6d4135a987fe64d275049
zv error key for curve: c2tnb191v1 Private key is not valid for specified curve.
zv error key for curve: c2tnb191v2 Private key is not valid for specified curve.
zv error key for curve: c2tnb191v3 Private key is not valid for specified curve.
zv error key for curve: c2tnb239v1 Private key is not valid for specified curve.
zv error key for curve: c2tnb239v2 Private key is not valid for specified curve.
zv error key for curve: c2tnb239v3 Private key is not valid for specified curve.
zv key for curve: c2tnb359v1 045b5a4b483ee57985e78864784ee25e85c5ed691d0ed1c1b3aec555ef3e60727269a90041610b28d67a2f1abb3a01ed0f7cc09d71b7dbed9284bf1dd58ef006b5403d08af8b3b10aeb89177859439ed0c7ee174b5ce03abef63e6
zv key for curve: c2tnb431r1 0477f85a2651c7afd71f44d5743ad8823993546c6ee7776b9f596f7b20f755b4699392ef9c0d06e18a691e0d2326ad56d256b19260fbee03b799154b86741b3c625575611f0169efcf29ec2de929823628e87f36e5e490f981c63e67bb9fa285a201d2b0204a3e953d98f0fd81
zv error key for curve: prime192v1 Private key is not valid for specified curve.
zv error key for curve: prime192v2 Private key is not valid for specified curve.
zv error key for curve: prime192v3 Private key is not valid for specified curve.
zv error key for curve: prime239v1 Private key is not valid for specified curve.
zv error key for curve: prime239v2 Private key is not valid for specified curve.
zv error key for curve: prime239v3 Private key is not valid for specified curve.
zv key for curve: prime256v1 04b763076d9b55bed27071b78123dfa463681b89235412c387395d5fe1f28acc823d883be43299c40e72df1d1d5735215bfac7e295534d2abc4a5ce2a75dc5d2c5
zv error key for curve: secp112r1 Private key is not valid for specified curve.
zv error key for curve: secp112r2 Private key is not valid for specified curve.
zv error key for curve: secp128r1 Private key is not valid for specified curve.
zv error key for curve: secp128r2 Private key is not valid for specified curve.
zv error key for curve: secp160k1 Private key is not valid for specified curve.
zv error key for curve: secp160r1 Private key is not valid for specified curve.
zv error key for curve: secp160r2 Private key is not valid for specified curve.
zv error key for curve: secp192k1 Private key is not valid for specified curve.
zv error key for curve: secp224k1 Private key is not valid for specified curve.
zv error key for curve: secp224r1 Private key is not valid for specified curve.
zv key for curve: secp256k1 042a7ddb7bf7ab537fad07b734932cab3457ee4ca85ebd9c1907e5e3f1d5262c29a08c14f3a43fedc1c7c78a63708c874d0e78d8e0e88a5bd0519dd777df7cd26e
zv key for curve: secp384r1 0490e7edcf4184faaefee78a4ab4efc78b794a2e3a6237b59dcd6f64eb2c1c6d932d3c763d808abac6807da746c605c564122ccff883f825dbe604439f919afeb57d5cc6798405ab10a2efe21c923774f03d5df54758f8cd977906e80c160bb0da
zv key for curve: secp521r1 04000a763b89a9e9a76fde1c0c757dc417f1cde0e103af08ba8e3c185c4945298e1dee4ac5383b5625826d6ad64d7e518b83d009cf6a69fa5f9428798e5f07200ad6e4008addedb5edc50e0bd1a72be3753ec9595809e8c9843842f69e8ba6e6d0df1003837384fbba20595e6989eb71203f94341936482040ec603c2900e16bddfdc0d571
zv error key for curve: sect113r1 Private key is not valid for specified curve.
zv error key for curve: sect113r2 Private key is not valid for specified curve.
zv error key for curve: sect131r1 Private key is not valid for specified curve.
zv error key for curve: sect131r2 Private key is not valid for specified curve.
zv error key for curve: sect163k1 Private key is not valid for specified curve.
zv error key for curve: sect163r1 Private key is not valid for specified curve.
zv error key for curve: sect163r2 Private key is not valid for specified curve.
zv error key for curve: sect193r1 Private key is not valid for specified curve.
zv error key for curve: sect193r2 Private key is not valid for specified curve.
zv error key for curve: sect233k1 Private key is not valid for specified curve.
zv error key for curve: sect233r1 Private key is not valid for specified curve.
zv error key for curve: sect239k1 Private key is not valid for specified curve.
zv key for curve: sect283k1 04062b7bf253e570356ebbb329d1da1d95ddf11c639d54028245465a82896db73a6273202002ac25e8f181615e3628c7b2606e7c0123b7987bfe33c53b0181f52b6ebfce45ee057c89
zv key for curve: sect283r1 04043114aa85008c74d399a39db3c83d13ad5cbb9a06610f71696474e9c7101e101ca253bd0195875dfa62fc775a29207b152c38bbd4609cef8554ea4f3ab38388ae47e43a265952a9
zv key for curve: sect409k1 040118f81966cd740080120b1bee8e8dc86026c5fdae27c5377c15443c0cdf2f4997f27930c8f38d49825316f8afa8f4f60b16a59a00544b2518fd74655d2269a7cc11882cb005e5efb3935bdf49593d7a9aaff8da8f2ef925d009f4f5fa2871af95f101a8ec503093
zv key for curve: sect409r1 040062eb85662eb663947a7c8f609434f120b147fd7e9cc112f6ed0c382eebf1b666d94ae292eb7e39e51cef10ec5a0fee418b89d101ad9bdc6773c81c5f2a66b672d65ae28e71af8782982d5c51255f2bf221acc31e8ca98eea29847e95ee1cb6a6e30db233ce80e8
zv key for curve: sect571k1 040778f3bea3a950d834874338f9b5c45e0fa68836a0de39a59b3d6e79e939489b73c4aa1a54178a2e147b9d592444b0f985373898464e24b566c550948e13302a1dc61210be076b47049e56c4763295fbda62896cbf973bdacc53faba9d67dd55787641c79bb87dd6de105841f95998c8b06a683f6b70bc921b67166bbf58c0f25e77d84907cf5ddb52929c73e3e95651
zv key for curve: sect571r1 04027732ed62b60d6e1567c5a432e4b0c070447724aaac7a345e73168b22a1200f57f6c186e71f65a86aaca3dc4cff772f77e64cba620dff666448a2ec1a05f77f3f1eb535fd8f2cf502d25bdd48cdc7fd5de10d21ac901e1dd2c84892f31620e4c28df2851a8f2de06ba2754f3683a30389704b1cfbfad1287e4e1c9f369eec680d27f2a1546691dcf6c8e28e77514d03
zv error key for curve: wap-wsg-idm-ecid-wtls1 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls10 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls11 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls12 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls3 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls4 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls5 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls6 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls7 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls8 Private key is not valid for specified curve.
zv error key for curve: wap-wsg-idm-ecid-wtls9 Private key is not valid for specified curve.

*/

/*
Example (obtaining a shared secret):
const crypto = require('crypto');
const alice = crypto.createECDH(defaultCurve);
const bob = crypto.createECDH(defaultCurve);

// This is a shortcut way of specifying one of Alice's previous private
// keys. It would be unwise to use such a predictable private key in a real
// application.
alice.setPrivateKey(
  crypto.createHash('sha256').update('alice', 'utf8').digest()
);

// Bob uses a newly generated cryptographically strong
// pseudorandom key pair
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret and bobSecret should be the same shared secret value
console.log(aliceSecret === bobSecret);
 */

/*

*/

/*
module.exports.encryptText = (text, pass, padding = crypto.constants.RSA_PKCS1_PSS_PADDING) => {
  const buff = crypto.publicEncrypt(Buffer.from(pass, 'utf8'), Buffer.from(text, 'utf8'));
  return buff.toString('utf8');
};

module.exports.decryptText = (ctext, pass, padding = crypto.constants.RSA_PKCS1_PSS_PADDING) => {
  const buff = crypto.publicDecrypt(Buffer.from(pass, 'utf8'), Buffer.from(ctext, 'utf8'));
  return buff.toString('utf8');
};
*/

/*
module.exports.getPublicKey0 = (hashAlg = 'modp1') => {
  const alice = crypto.getDiffieHellman(hashAlg);
  alice.generateKeys();
  const pkey = alice.getPublicKey('hex');
  clientServerPubs.set(pkey, alice); //.substring(0,32)
  console.log("zv PublicKey:", pkey);
  return pkey;
};
 */