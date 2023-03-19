const axios = require(`axios`);
const fs = require('fs');
const stringify = require(`json-stringify-safe`);
const httpExceptionHandler = require(`./http-exception-handler`);
const chalk = require('chalk');
const log = console.log;

async function doFetch(method, url, headers, data, params, auth, logger, routeData, pageSize, limit) {
  let completeResult = [];
  let doRead = true;
  let page = 0;
  let fetchErrors = 0;
  let count = 0;
  if (!pageSize || (limit && pageSize > limit)) pageSize = limit;

  do { //per page...
    if (pageSize > 0) { //make pagination...
      params.size = pageSize;
      params.page = page;
    }

    const options = {
      method: method,
      url: url,
      headers: headers,
      data: data,
      params: params
    };
    if (auth) {
      options.auth = auth;
    }
    logger && logger(`loading page ${page}; pageSize: ${pageSize}; limit: ${limit}; server: ${url}`);
    const response = await axios(options);
    routeData = response.data;
    const fetched = Array.isArray(routeData) ? routeData.length: 0;
    logger && logger(`fetched: ${fetched}; on page: ${page}; count+fetched: ${count+fetched}`);

    if (fetched) {
      if (routeData[fetched-1].hasOwnProperty('errors')) {
        fetchErrors++;
      }
      else {
        page = completeResult.push(routeData);
        count+=fetched;
        doRead = ((pageSize && pageSize === fetched) ? (limit ? count < limit: true): false);
        fetchErrors=0;
      }
    }
    else {
      fetchErrors++;
    }
  } while (doRead && fetchErrors < 3);
  logger && logger(`..zv: doFetch() return: ${completeResult.length} pages; fetchErrors: ${fetchErrors}`);

  return completeResult;
}

async function fetch({
  url,
  method,
  headers,
  data,
  name,
  localSavePath,
  auth,
  params,
  verbose,
  cache,
  useCache,
  shouldCache,
  pageSize,
  limit
}) {

  // Attempt to download the data from api
  let routeData = useCache && await cache.get(url);

  if (!routeData) {
    try {
      const dataPages = await doFetch(method, url, headers, data, params, auth, verbose && log, routeData, pageSize, limit);
      if (dataPages.length) {
        routeData = dataPages.flat(1);
        if (limit && routeData.length > limit) {
          routeData = routeData.slice(0, limit);
        }
        if (shouldCache) {
          await cache.set(url, routeData);
          await cache.set('cacheTimestamp', new Date().toISOString());
        }
      }
    } catch (e) {
        log('\nGatsby Source Api Server response error:\n', e.response.data && e.response.data.errors);
        httpExceptionHandler(e);
        routeData = shouldCache && await cache.get(url); // chance for cache
    }
  } else {
    if (verbose) console.log(`using cached data for ${url}`);
  }

  if (routeData) {
    if(typeof localSavePath === 'string' && localSavePath) {
      try { // Create a local save of the json data in the user specified path...
        fs.writeFileSync(`${localSavePath}${localSavePath.endsWith('/') ? '': '/'}${name}.json`, stringify(routeData, null, 2));
      } catch(err) {
        console.log(`Plugin CDEK could not save the file.  Please make sure the folder structure is already in place.`, err);
      }
      if(verbose) log(chalk`{bgCyan.black Plugin CDEK} ${name}.json was saved locally to ${localSavePath}`);
    }
    return routeData;
  }
}

module.exports = fetch;
