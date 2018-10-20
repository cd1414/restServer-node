const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = new express();

// app.get('/user', (req, res) => {
//     res.json('Get user');
// });


app.post('/user', (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        })
    });

    // if (body.name === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         error: 'name is required'
    //     })
    // } else {
    //     res.json({
    //         user: body
    //     });
    // }
});

app.get('/user', (req, res) => {
    let since = Number(req.query.since || 0);
    let limit = Number(req.query.limit || 0);

    User.find({ status: true }, 'name email role status google img')
        .skip(since)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // res.json({
            //     ok: true,
            //     users
            // })

            User.count({ status: true }, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count
                })
            });
        })
});

app.put('/user/:id', (req, res) => {

    console.log('here');

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    })
});

app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    let changes = {
        status: false
    }

    User.findByIdAndUpdate(id, changes, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: 'User not found'
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
    //Delete an user from database
    // User.findByIdAndRemove(id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!userDeleted) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: 'User not found'
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         user: userDeleted
    //     })
    // });
});

module.exports = app;