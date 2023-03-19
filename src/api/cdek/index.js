/*
 "dependencies": {
  "axios": "^0.19.0",
  "babel-cli": "^6.26.0",
  "babel-runtime": "^6.26.0",
  "chalk": "^2.3.2",
  "deep-map-keys": "^1.2.0",
  "json-stringify-safe": "^5.0.1",
  "kind-of": "6.0.3",
  "nanoid": "^1.0.2"
}
*/
require('babel-polyfill');

const axios = require('axios');
const fetch = require(`./fetch`);
const normalize = require(`./normalize`);
// const objectRef = require(`./src/helpers`).objectRef
const forEachAsync = require('./src/helpers').forEachAsync;

const NodeCache = require( "node-cache" );
const cdekCache = new NodeCache();

const cdekSource = async ({ /** globals, then entitiesArray */
  typePrefix = 'CDEK_', /** Global type prefix of entities from server */
  baseUrl, /*** global baseUrl (domain/version) */
  method = 'get',  /**default method */
  headers = {"Content-Type": "application/json"}, /**default headers */
  skipCreateTable = false, /** if only local save to file needed */
  localSavePath, /* if specified then JSON data will be saved to local file with the entity name; This folder must already exist */
  auth0Config = false,
  // schemaType,
  verbose = false,
  cacheLifetimeSeconds = 0, /** enable disk caching, if > 0 */
  pageSize = 0, /**enable pagination if pageSize > 0 */
  entitiesArray = [{}]
}) => {
  //store the attributes in an object to avoid naming conflicts
  const attributes = {typePrefix, baseUrl, method, headers, skipCreateNode: skipCreateTable, localSavePath, pageSize/*, schemaType*/};

  if (verbose) console.log(`\n..zv: sourceNodes.options for cdek:`, attributes, auth0Config);

  let authorization;
  if (auth0Config) {
    console.time('\nAuthenticate user');
    try {
      if (auth0Config.params.client_id.length < 10) throw new Error('..zv: seems a problem with env config');
      const url = auth0Config.url.startsWith('/') ? baseUrl + auth0Config.url: auth0Config.url;
      const loginResponse = await axios({...auth0Config, url});
      // console.log('\n..zv: loginResponse:', loginResponse);
      if (loginResponse.hasOwnProperty('data')) {
        authorization = 'Bearer ' + loginResponse.data.access_token;
      }
      else {
        console.error('\n..zv: auth has no field: data');
      }
    } catch (error) {
      console.error('\nEncountered authentication error: ' + error);
    }
    console.timeEnd('\nAuthenticate user');
  }
  if (!authorization) return console.error('\n..zv: api-cdek authorization error'); //may be from cache...? no

  let useCache = !!cacheLifetimeSeconds;
  if (useCache) {
    const cacheTimestamp = await cdekCache.get('cacheTimestamp');
    if (cacheTimestamp) {
      const cacheDate = new Date(cacheTimestamp);
      const cacheMillis = cacheDate.getTime();
      const ageInMillis = Date.now() - cacheMillis;
      useCache = ageInMillis < (cacheLifetimeSeconds * 1000);
      if (!useCache) {
        console.log(`not using cache as its too old ${ageInMillis / 1000}s`);
      }
    }
  }

  await forEachAsync(entitiesArray, async (entity) => {
    // mix entity and general properties...
    if (verbose) console.log(`\n..zv: fetch entity:`, entity);
    const typePrefix = entity.typePrefix ? entity.typePrefix : attributes.typePrefix;
    const url = entity.url ? entity.url.startsWith('/') ? attributes.baseUrl + entity.url : entity.url : attributes.baseUrl;
    const method = entity.method ? entity.method : attributes.method;
    const headers = entity.headers ? entity.headers : attributes.headers;
    const skipCreateTable = entity.skipCreateNode ? entity.skipCreateNode : attributes.skipCreateNode;
    const localSavePath = entity.localSavePath ? entity.localSavePath : attributes.localSavePath;
    const pageSize = typeof entity.pageSize === 'number' ? entity.pageSize : attributes.pageSize;
    // const schemaType = entity.schemaType ? entity.schemaType : attributes.schemaType;
    const params = typeof entity.params === 'object' ? entity.params: {};
    const name = entity.name;
    const data = entity.data;
    const limit = typeof entity.limit === 'number' ? entity.limit: 0;

    if (authorization) headers.Authorization = authorization;
    // Create an entity type from prefix and name supplied by user
    let entityType = `${typePrefix}${name}`;
    // console.log(`entityType: ${entityType}`);

    // Fetch the data entities[]
    const entities = await fetch({url, method, headers, data, name, localSavePath, params, verbose, cache: cdekCache, useCache, shouldCache: !!cacheLifetimeSeconds, pageSize, limit});

    // Skip node creation if the goal is to only download the data to json files
    if(skipCreateTable) {
      return;
    }

    // Generate the nodes
    normalize.createNodesFromEntities({
        entities,
        entityType,
        // schemaType,
    });
  });

  // We're done, return.
  return;
};
module.exports.cdekSource = cdekSource;