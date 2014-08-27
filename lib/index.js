'use strict';

module.exports.config = function (extension, opts, next) {

    extension.api({
        path: '/andrea',
        method: 'GET',
        config:{
            handler: function (req, reply) {
                reply('hi andrea');
            },
            auth: false
        }
    });
    next();
};
