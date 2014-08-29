'use strict';

module.exports = function (mongoose) {
    var BookSchema = require('./book-schema')(mongoose);
    return mongoose.model('Book', new BookSchema());
};