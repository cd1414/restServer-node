const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// get tjhe mongoose schema require to create our model
let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'Description is required']
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

categorySchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});

module.exports = mongoose.model('Category', categorySchema);