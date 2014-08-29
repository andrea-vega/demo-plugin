'use strict';

module.exports.config = function (extension, opts, next) {

    var books = require('./book-maker')(extension.app.mongoose);
    extension.api({
        path: '/books',
        method: 'POST',
        config: {
            auth: false,
            handler: function (req, reply) {
                books.makeBook(req.payload)
                    .then(reply)
                    .catch(reply);
            }
        }
    });
    next();
};