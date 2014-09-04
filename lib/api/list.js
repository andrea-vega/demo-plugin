'use strict';

module.exports = function (Book) {
    return {
        handler: function (req, reply) {
            Book.find({}, function (err, books) {
                if (err) {
                    reply(err);
                }
                reply({items: books});
            });
        },
        plugins: {
            hal: {
                api: 'inf:books',
                embedded: {
                    'inf:book': {
                        path: 'items',
                        href: './{item.slug}'
                    }
                }
            }
        }
    };
}