'use strict';

var util = require('util');

module.exports = function (mongoose) {

    var Schema = mongoose.Schema;

    function BookSchema(definition) {
        Schema.call(this, definition, {
            collection: 'books'
        });
        this.add({
            title: String,
            author: String,
            dataset: String,
            cover: String,
            date_created: { type: Date, default: Date.now },
            pages: [
                {
                    content: { type: Object },
                    image: { type: String }
                }
            ]
        });
    }

    util.inherits(BookSchema, Schema);
    return BookSchema;
};