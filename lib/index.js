'use strict';

var inflect = require('i')(true);

module.exports.config = function (extension, opts, next) {

    extension.api({
        path: '/andrea',
        method: 'GET',
        config:{
            handler: function (req, reply) {
                reply(inflect.humanize('andrea'));
            },
            auth: false
        }
    });
    next();
};
