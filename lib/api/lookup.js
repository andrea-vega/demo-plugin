'use strict';

module.exports = function (Book) {
    return {
        handler: function (req, reply) {
            Book.find({slug: params.id}, reply);
        },
        plugins: {
            hal: {
                api: 'inf:book'
            }
        }
    };
};