/*
*/
const appver        = '1.0'
const path          = require('path');
const express       = require('express');
const app           = express();

const API           = require('./src/api');
const configuration = {
  'isDeveloping' : process.env.NODE_ENV == 'development' || ! process.env.NODE_ENV,
  'environment'  : process.env.APP_ENV  || 'dev',
  'version'      : process.env.APP_VERSION || '1.0.1'
};


const args = process.argv || [];

function server(config) {
  const port = config.port;
  const host = config.host;  
  const site = config.staticFilesHandler;

  //app.appKey = configuration.appKey;

  if (config.serveStatic) {
    app.use(express.static(__dirname + '/dist'));
  }
  app.use('/*', site);
  app.get('*', site);

  app.listen(port, host, function onStart(err) {
    if (err) { console.log(err); }
    console.log('==> Listening on port %s. Open up http://' + host + ':%s/ in your browser.', port, port);
  });
}

if ( args[2] ) { configuration.action = {'render': args[2], 'alfa': args[3], 'beta': args[4], 'gamma': args[5] }; }

/******************************************************************************
******************************************************************************/
new API(app, configuration);

/******************************************************************************
******************************************************************************/
if (!configuration.isDeveloping) {
  const config = {
    isDeveloping: configuration.isDeveloping,
    port: process.env.PORT || 8080,
    host: configuration.isDeveloping ? 'localhost' : '0.0.0.0',
    serveStatic: true,
    staticFilesHandler: function response(req, res) {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    },
  };
  server(config);
}
module.exports = server;