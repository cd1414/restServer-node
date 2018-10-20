const express = require('express');
const app = new express();

//definition of routes
app.use(require('./user'));
app.use(require('./login'));

module.exports = app;