const express = require('express');
const app = new express();

//definition of routes
app.use(require('./user'));
app.use(require('./login'));
app.use(require('./category'));
app.use(require('./product'));

module.exports = app;