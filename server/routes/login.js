const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client(process.env.CLIENT_ID);
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

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;


    console.log(token);

    let googleUser = await verify(token)
        .catch(err => {
            res.status(403).json({
                ok: false,
                err
            })
        });

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (userDB) {

            if (userDB.google === false) {

                console.log(userDB);
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Use the aplication user and password'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }
        } else {
            // user doesnt exist in the database
            let user = new User();;
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, user) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    user: user
                }, process.env.SEED, { expiresIn: process.env.EXPIRES_TOKEN });

                return res.json({
                    ok: true,
                    user: user,
                    token
                })
            });
        }

    });

    // res.json({
    //     user: googleUser
    // })
});


// Google set ups
let verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID //specify the CLIENT_ID off the app
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }


};
module.exports = app;