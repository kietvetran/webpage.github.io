/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
var proxy = require('http-proxy-middleware');
const server = require('./deploy/server');

server({
  'isDeveloping': true,
  'port'        : 3000,
  'host'        : 'localhost',
  'serveStatic' : false,
  'staticFilesHandler': proxy({
	  'target': 'http://localhost:' + 3001 + '/',
	  'ws'    : false
	})
});
