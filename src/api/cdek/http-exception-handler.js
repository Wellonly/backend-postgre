const chalk = require('chalk');

/**
 * Handles HTTP Exceptions (axios)
 *
 * @param {any} e
 */

 function httpExceptionHandler(e) {
   const { response, code } = e;
   if(!response) {
     console.log(chalk`{bgRed Plugin CDEK} The request failed. Error Code: ${code}`);
     return console.log(`Plugin CDEK http request failed. Error Code: ${code}`, e);
   }
   const { status, statusText, data: { message } } = e.response;
   console.log(chalk`\n{bgRed Plugin CDEK} The server response was "${status} ${statusText}"`);
   if (message) {
     console.log(chalk`{bgRed Plugin CDEK} Inner exception message : "${message}"`);
  }
  return console.log(`Plugin CDEK http request failed. The server response was "${status} ${statusText}"`, e);
}

module.exports = httpExceptionHandler;
