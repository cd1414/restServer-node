// Homework
// Requirements
// 1. Create all the routes and validations requires
// 2. All the register users could create, read, update and delete products 
//
// Tasks
// 1. Get all the produts
// - Populate: user and category info
// - Paged
// 2. Get a product by Id
// - Populate: user and category info
// 3. Create a product
// - Include user and cateogry info
// 4. Update a product 
// 5. Delete a product by Id
// - Mark as unavailable not deleted for database

const express = require('express');
const { verifyToken } = require('../middlewares/authentication');
const Product = require('../models/product');

const app = express();

// ========================
// Create a product
// ========================
app.post('/product', verifyToken, (req, res) => {
    let body = req.body;
    // new product
    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user: req.user._id
    });

    // save
    product.save((err, productBD) => {
        if (err) {
            res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (!productBD) {
            res.status(400)
                .json({
                    ok: false,
                    err: 'Product no created'
                });
        }
        res.json({
            ok: true,
            product: productBD
        });
    });
});

// ========================
// Get all the products
// ========================
app.get('/product', verifyToken, (req, res) => {

    let since = req.query.since | 0;
    let limit = req.query.limit | 10;

    Product.find({ available: true })
        .skip(since)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productList) => {
            if (err) {
                res.statas(500)
                    .json({
                        ok: false,
                        err
                    })
            }
            res.json({
                ok: true,
                productList
            });
        });
});


// ========================
// Get a products by id
// ========================
app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('User', 'name email')
        .populate('Category', 'description')
        .exec((err, productBD) => {
            if (err) {
                res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }
            if (!productBD) {
                res.status(400)
                    .json({
                        ok: false,
                        err: `Product not found`
                    });
            }
            res.json({
                ok: true,
                product: productBD
            });
        });
})


// ========================
// Search a products 
// ========================
app.get('/product/search/:filter', verifyToken, (req, res) => {
    let filter = req.params.filter;
    let regex = new RegExp(filter, 'i');
    Product.find({ description: regex })
        .populate('category', 'description')
        .exec((err, productList) => {
            if (err) {
                res.json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productList
            });
        });
});

// ========================
// Update a product
// ========================
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        res.json({
            ok: true,
            productDB
        })
    });
});


// ========================
// Delete a product
// =======================
app.delete('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let changes = {
        available: false
    }

    Product.findByIdAndUpdate(id, changes, (err, productBD) => {
        if (err) {
            res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        res.json({
            ok: true,
            productBD
        });
    });
});

// Export routes
module.exports = app;