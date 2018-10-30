const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authentication.js');

const app = express();

app.get('/image/:type/:img', verifyTokenImg, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    console.log(pathImg)
    if (!fs.existsSync(pathImg)) {
        pathImg = path.resolve(__dirname, '../assets/img/no-image.jpg')
    }

    res.sendFile(pathImg);

});

module.exports = app;