'use strict';

const connect = require('./database');
const express = require('express');

const server = express();
const port = process.env.PORT || 3000;

/**
 * Sets the view engine to ejs and initializes middleware.
 */
server.set('view engine', 'ejs');
server.use(express.json());

// Connect to the database and export the app
connect()
  .then(() => {
    return new Promise((resolve) => {
      server.listen(port, () => {
        console.log('Express started. Listening on %s', port);
        resolve(server);
      });
    });
  })
  .catch((error) => {
    console.log('Invalid database connection:', error);
  });

module.exports = server;