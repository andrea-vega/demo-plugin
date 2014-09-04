'use strict';

var joi = require('joi');
var hoek = require('hoek');

module.exports = function (Book, Dataset, esClient) {

    var makeBook = require('../book-maker')(Book, Dataset, esClient);

    return {
        pre: [
            { assign: 'me', method: 'getUser(auth.credentials.obj)' }
        ],
        handler: function (req, reply) {
            makeBook(hoek.merge(req.payload, {
                author: req.pre.me.displayName
            })).then(function (book) {
                reply(book).location('/api/books/' + book.slug);
            }).catch(reply);
        },
        validate: {
            payload: joi.object().keys({
                title: joi.string().required(),
                imageQuery: joi.string().required(),
                filter: joi.object().required(),
                imgColorType: joi.string().default('color')
            }).unknown(true)
        },
        plugins: {
            hal: {
                api: 'inf:book'
            }
        }
    };
}