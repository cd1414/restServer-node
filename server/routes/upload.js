const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');


const User = require('../models/user');
const Product = require('../models/product');

const app = express();

//default options
app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    let validType = ['users', 'products'];


    if (validType.indexOf(type) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Valid types are ' + validType.join(',')
                }
            });
    }

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No files were uploaded.'
                }
            })
    }
    // The name of the input field
    let file = req.files.file;

    // Get the name and the extension
    let fileInfo = file.name.split('.');
    let fileExtension = fileInfo[1];

    // valid extension files
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(fileExtension) < 0) {
        return res.status(400)
            .json({
                ok: true,
                err: {
                    message: 'Valid file extension are: ' + validExtensions.join(','),
                    ext: fileExtension
                }
            })
    }

    // change file name
    let fileName = `${id}-${ new Date().getMilliseconds()}.${fileExtension}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (type === 'users') {
            imageUser(id, fileName, res);
        } else {
            imageProduct(id, fileName, res);
        }
    });
});

let imageUser = (userId, fileName, res) => {
    User.findById(userId, (err, userDB) => {
        if (err) {
            deleteFile(fileName, 'users');
            res.status(500)
                .json({
                    ok: false,
                    err: 'as'
                });
        }
        if (!userDB) {
            deleteFile(fileName, 'users');
            res.status(500)
                .json({
                    ok: false,
                    err: {
                        message: 'User does not exist'
                    }
                })
        }

        if (userDB.img) {
            deleteFile(userDB.img, 'users');
        }
        userDB.img = fileName;
        userDB.save((err, userSaved) => {
            res.json({
                ok: true,
                user: userSaved
            })
        });
    })
};

let imageProduct = (productId, fileName, res) => {
    Product.findById(productId, (err, productBD) => {
        if (err) {
            deleteFile(fileName, 'products');
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }
        if (!productBD) {
            deleteFile(fileName, 'products');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                })
        }
        if (productBD.img) {
            deleteFile(productBD.img, 'products');
        }
        productBD.img = fileName;
        productBD.save((err, productSaved) => {
            if (err) {
                deleteFile(fileName, 'products');
                res.status(400)
                    .json({
                        ok: false,
                        err
                    });
            }
            res.json({
                ok: true,
                product: productSaved
            });
        });
    })
}


let deleteFile = (fileName, type) => {
    let pathUrl = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

// Export
module.exports = app;