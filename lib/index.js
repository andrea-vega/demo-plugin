'use strict';

var BPromise = require('bluebird');

module.exports.config = function (extension, opts, next) {
    var Book, Dataset, esClient;

    //elastic search for getting dataset aggregates
    esClient = extension.plugins['ent-elasticsearch'].client;

    // promisify mongoose and elasticsearch
    BPromise.promisifyAll(esClient);
    BPromise.promisifyAll(extension.app.mongoose);

    // mongoose models
    Book = require('./book-model')(extension.app.mongoose);
    Dataset = extension.app.mongoose.model('Dataset');

    // books api
    extension.api(require('./api')(Book, Dataset, esClient));

    next();
}
;