const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = new express();

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!userBD) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'User or password not valid'
                }
            })
        }
        if (!bcrypt.compareSync(body.password, userBD.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'User or password not valid'
                }
            })
        }
        let token = jwt.sign({
            user: userBD
        }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN });

        res.json({
            ok: true,
            user: userBD,
            token
        });
    });
});

module.exports = app;