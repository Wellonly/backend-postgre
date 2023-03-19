const { models } = require('../models');

let lastHttpRequest, lastUID;
const remoteAddresses = new Map();

const secureReturn = (path, message = '', args = undefined, req = lastHttpRequest, uid = lastUID) => {
  log2db(path, message.concat('\nargs:', JSON.stringify(args)), req, uid);
  return undefined;
}
module.exports.secureReturn = secureReturn;

const log2db = async (path, message = undefined, req = lastHttpRequest, uid = lastUID) => {
  const logHttp = req ? parseGraphqlRequest(req): null;
  const log = await models.Log.create({ path, message, ...logHttp, uid});
  console.log("\n..zv log2db: uid:", uid, Date().toLocaleString(), path, message, logHttp);
  return log;
};
module.exports.log2db = log2db;

const logWithPrefix = (prefix, data) => {
  console.log(prefix, data);
};
module.exports.logWithPrefix = logWithPrefix;

function parseGraphqlRequest(req) {
  const httpBody = (req && req.body) || null;
  const body = typeof httpBody === 'object' ? {...httpBody}: {query: httpBody, operationName: "plain http body"};
  const address = (req && req._remoteAddress) || null;
  const origin = (req && req.headers && req.headers.origin) || null;
  if (typeof body.query === 'string') {
    body.query = body.query.split('\n')[0]; //the shorteness: take only first line
  }
  return {
    ...body,
    remoteAddress: address,
    origin: origin,
  };
};

const updateLastHttpRequest = (req, uid = 0) => {
  lastHttpRequest = req;
  lastUID = uid;
};
module.exports.updateLastHttpRequest = updateLastHttpRequest;

const logUserHttp = (req, userSession) => {
  console.log(`\n..zv-log http for user: ${userSession.username}`, { ...parseGraphqlRequest(req) });
    // process.env.isDebug && console.log("zv req headers:", req.headers);
};
module.exports.logUserHttp = logUserHttp;

const logAnonimousHttp = (req) => {
  const reqData = parseGraphqlRequest(req);
  const now = Date.now();
  const ra = remoteAddresses.get(reqData.remoteAddress);
  if (!ra) {
    remoteAddresses.set(reqData.remoteAddress, {total: 1, first: now});
    // delete reqData.body; delete reqData.query;
    console.log("\n..zv-log http anonim new:", Date().toLocaleString(), { ...reqData });
    return;
  }
  ra.total++;
  console.log(`\n..zv-log http anonim at: ${Date().toLocaleString()}; total: ${ra.total}`, { ...reqData });
};
module.exports.logAnonimousHttp = logAnonimousHttp;

module.exports.parseGraphqlRequest = parseGraphqlRequest;