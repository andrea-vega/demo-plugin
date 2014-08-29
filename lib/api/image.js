'use strict';

var img = require('../search');
var joi = require('joi');
var googleapis = require('googleapis');
var search = googleapis.customsearch('v1');
var request = require('request');

module.exports = {
    path: '/image',
    method: 'GET',
    config: {
        validate: {
            query: {
                value: joi.string().required(),
                color: joi.string(),

            }
        },
        auth: false,
        handler: function (req, reply) {
            var params = {
                q: req.query.value,
                searchType: 'image',
                safe: 'high',
                imgSize: 'large',
                auth: 'AIzaSyCaLS8pZLHpjvLMbF6RJQ53WqDdFyFytmk',
                cx: '000578053474489133467:tfiodz3ku30'
            };
//            search.cse.list(params, function(err, images) {
//                reply(request.get({ url: result.image }));
//            });
            var result = require('../../test/mocks/asia-images.js');
            reply(request.get({url: result.items[0].link}));
        }
    }
};