'use strict';

var util = require('util');
var slug = require('mongoose-slug-unique');

module.exports = function (mongoose) {

    var Schema = mongoose.Schema;

    function BookSchema(definition) {
        Schema.call(this, definition, {
            collection: 'books'
        });
        this.add({
            title: { type: String, unique:true },
            description: String,
            author: String,
            dataset: String,
            genre: String,
            date_created: { type: Date, default: Date.now },
            images: [],
            pages: []
        });
        this.plugin(slug('title'));
    }

    util.inherits(BookSchema, Schema);
    return BookSchema;
};