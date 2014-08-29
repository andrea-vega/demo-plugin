'use strict';

var _ = require('lodash');
var imageSearch = require('googleapis').customsearch('v1');
var BPromise = require('bluebird');

module.exports = function (mongoose) {

    var Book = require('./book-model')(mongoose);
    var Dataset = mongoose.model('Dataset');

    function findImages(query, limit) {
        return new BPromise(function (resolve, reject) {
            var params, images;

            // let's get at least 100 images, because we are limited on API calls and we might use them
            limit = limit > 100 ? limit : 100;

            params = {
                q: query.value,
                searchType: 'image',
                safe: 'high',
                imgSize: 'large',
                auth: 'AIzaSyCaLS8pZLHpjvLMbF6RJQ53WqDdFyFytmk',
                cx: '000578053474489133467:tfiodz3ku30',
                num: limit
            };

//            imageSearch.cse.list(params, function(err, images) {
            setTimeout(function () {
                images = require('../test/mocks/asia-images.js');
                resolve(_.pluck(images, 'link'));
            }, 0);
        });
    }

    function makePages(rows, images) {
        var pages = [], i = 0;
        _.forEach(rows, function (row) {
                pages.push({
                    content: row,
                    image: images[i]
                });
                i++;
                if (i >= images.length) {
                    //start back over at image #1 if we have run out of images.
                    i = 0;
                }
            }
        );
        return pages;
    }

    return {
        makeBook: function makeBook(data, options) {
            return new BPromise(function (resolve, reject) {
                var book = new Book({
                    title: 'All about Asia',
                    author: 'Andrea Vega',
                    cover: 'http://global.unc.edu/files/2013/03/2012_Feb27_Asia.png',
                    pages: [
                        {
                            content: { value: 'Asia is a country' },
                            image: 'http://www.unitedplanet.org/ckfinder/userfiles/images/volunteer-in-asia/asia.jpg'
                        },
                        {
                            content: { value: 'Asia has people' },
                            image: 'http://www1.ifc.org/wps/wcm/connect/95b674004a584f10b8b3bf8969adcc27/south_asia_map.gif?mod=ajperes'
                        }
                    ]
                });
//        findImages(options.query)
//            .then(makePages());
                book.save(function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(book);
                });
            });
        }
    };
};