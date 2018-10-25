require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = new express();

const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application.json
app.use(bodyParser.json());

//expose public folder
app.use(express.static(path.resolve(__dirname, '../public')));

//import and use the routes
app.use(require('./routes/index'));



//connect to the mongo dabase
//run mongod.exe first to get the port dabase name
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resp) => {
    if (err) throw err;

    console.log('Database online!');
});

app.listen(process.env.PORT, () => {
    console.log('Listen port: ', process.env.PORT);
});