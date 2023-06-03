import { cloneDeep } from 'lodash';
import { models } from '../models';
import { operationNameLength, remoteAddressLength, originLength, pathLength } from '../models/log';
import { getSchemaAndTableName } from './ra-sequelize';

let lastHttpRequest: object | undefined, lastUID: number;
const remoteAddresses = new Map();

export function secureReturn(path: string, message = '', args?: any, model?: any, req = lastHttpRequest, uid = lastUID) {
  log2db(
    path.concat(':', model ? getSchemaAndTableName(model): ''),
    message.concat('\nargs:', JSON.stringify(args)),
    req, uid);
  return undefined;
}

export function log2db(path: string, message?: string, req = lastHttpRequest, uid = lastUID) {
  const httpToLog = req ? parseGraphqlRequest(req): null;
  const pathToLog = (typeof path === 'string' && path.substring(0,pathLength)) || null;
  const log = models.Log.create({ ...httpToLog, path: pathToLog, message, uid}).then(row => row).catch(err => {
    return logError(err, 'error in log2db', {path, message, uid});
  });
  console.log("\n..zv log2db: uid:", uid, Date().toLocaleString(), path, message, httpToLog);
  return log;
};

export function logWithPrefix(prefix, data) {
  console.log(prefix, data);
};

export function parseGraphqlRequest(req) {
  const headers = req?.headers;
  const httpBody = (req && req.body) || null;
  const body = typeof httpBody === 'object' ? {...httpBody}: {query: httpBody, operationName: "plain http body"};
  const remoteAddress = (req && typeof req._remoteAddress === 'string' && req._remoteAddress.substring(0, remoteAddressLength)) || null;
  const origin = (req && req.headers && typeof req.headers.origin === 'string' && req.headers.origin.substring(0,originLength)) || null;
  const operationName = (typeof body.operationName === 'string' && body.operationName.substring(0, operationNameLength)) || null;
  const query = typeof body.query === 'string' ? body.query.split('\n')[0]: null; //the shorteness: take only first line
  const variables = (body && body.variables) ? cloneDeep(body.variables): null;
  if (variables) removeImagesDataFromLog(variables);
  return {
    // ...body,
    operationName,
    remoteAddress,
    origin,
    query,
    variables,
    headers,
  };
};

function removeImagesDataFromLog(vars) {
  ['images', 'artimages'].forEach(field => {
    if (Array.isArray(vars[field])) {
        vars[field].forEach(image => {
          if (image.hasOwnProperty('data')) {
            Reflect.deleteProperty(image, 'data');
          }
      });
    }
  });
}

export function updateLastHttpRequest(req, uid = 0) {
  lastHttpRequest = req;
  lastUID = uid;
};

export function logUserHttp(req, userProfile) {
  console.log(`\n..zv-log http for user: ${userProfile.username}`, { ...parseGraphqlRequest(req) });
    // process.env.isDebug && console.log("zv req headers:", req.headers);
};

export function logAnonimousHttp(req, user) {
  const reqData = parseGraphqlRequest(req);
  const now = Date.now();
  const ra = remoteAddresses.get(reqData.remoteAddress);
  if (!ra) {
    remoteAddresses.set(reqData.remoteAddress, {total: 1, first: now});
    // delete reqData.body; delete reqData.query;
    console.log(`\n..zv-log: http ${user?.username || 'anonim'} new:`, Date().toLocaleString(), { ...reqData });
    return;
  }
  ra.total++;
  if (ra.total%10 == 0) {
    console.log(`\n..zv-log: http ${user?.username || 'anonim'}; from: ${reqData.remoteAddress}; at: ${Date().toLocaleString()}; total: ${ra.total}`/* , { ...reqData } */);
  }
};

export function errorToString(err) {
  return (err && err.toString) ? err.toString(): 'error:'.concat(JSON.stringify(err));
}

export function logError(err, opname, args, model?: any) {
  return secureReturn(opname, errorToString(err), args, model);
};
