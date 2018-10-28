const express = require('express');
const Category = require('../models/category');
const { verifyToken, verifyAdmin_Role } = require('../middlewares/authentication');
const _ = require('underscore');

const app = new express();

// ===============
// Post a new category
// ===============
app.post('/category', [verifyToken, verifyAdmin_Role], (req, res) => {
    // get body request
    let body = req.body;
    let userId = 'userId';

    // create new category object
    let category = new Category({
        description: body.description,
        user: req.user
    });

    // save changes
    category.save((err, categoryBD) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoryBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            category: categoryBD
        })
    });

});

// ===============
// Get the list of categories
// ================
app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categories
            });
        })
});

// ===============
//  Get a category by Id
// ================
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id)
        .exec((err, categoryBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoryBD) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categoryBD
            });
        });
});

// ===============
//  Update a category 
// ================
app.put('/category/:id', [verifyToken, verifyAdmin_Role], (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Category.findByIdAndUpdate(id, body, { new: true, runValdidators: true }, (err, categoryBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryBD
        })
    });
});


// ===============
//  Delete a category 
// ================s
app.delete('/category/:id', [verifyToken, verifyAdmin_Role], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }
        res.json({
            ok: true,
            mesage: 'Category deleted'
        })
    })
});

module.exports = app;