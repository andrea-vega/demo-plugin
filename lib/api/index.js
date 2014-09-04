'use strict';

module.exports = function (Book, Dataset, esClient) {
    return [
        { path: '/books', method: 'GET', config: require('./list')(Book)},
        { path: '/books', method: 'POST', config: require('./create')(Book, Dataset, esClient)},
        { path: '/books/{id}', method: 'GET', config: require('./lookup')(Book)}
    ];
};