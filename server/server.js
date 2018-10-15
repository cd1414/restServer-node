require('./config/config');

const express = require('express');
const app = new express();
const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application.json
app.use(bodyParser.json());

app.get('/user', (req, res) => {
    res.json('Get user');
});


app.post('/user', (req, res) => {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            error: 'name is required'
        })
    } else {
        res.json({
            user: body
        });
    }
});


app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});


app.delete('/user', (req, res) => {
    res.json('DELETE user');
});


app.listen(process.env.PORT, () => {
    console.log('Listen port: ', process.env.PORT);
});