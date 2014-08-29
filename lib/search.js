'use strict';

var request = require('request');
var nom = require('nom');
var querystring = require('querystring');
var ImageResolver = require('image-resolver');
var search = require('./google-image-search');
var _ = require('lodash');
var googleapis = require('googleapis');

var internals = {};

// Search google image search API
internals.googleSearch = function (query, fn) {
    var url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + query;

    // get the images
    nom(url, function (err, $) {
        console.log($('#res img'));
        if (err) return fn(err);
        var imgs = $('#res img').parent().map(function () {
            var href = $(this).attr('href');
            var params = querystring.parse(href);
            return params['/url?q'];
        });
        fn(null, imgs);
    })
};

// Finds the "main" image on a webpage.
// Needed because google image search api returns the page the image is on instead of the image itself
internals.resolver = new ImageResolver();
internals.resolver.register(new ImageResolver.FileExtension());
internals.resolver.register(new ImageResolver.MimeType());
internals.resolver.register(new ImageResolver.Opengraph());
internals.resolver.register(new ImageResolver.Webpage());

internals.loadImage = function (images, i, done) {
    internals.resolver.resolve(images[i], function (result) {
        i++;
        if (result) {
            return done(null, request.get({ url: result.image }));
        }
        else if (i >= images.length) {
            return done(new Error('No image matches could be resolved'));
        }
        else {
            process.nextTick(function () {
                internals.loadImage(images, i, done);
            });
        }
    });
};

// Call search then resolve the image
exports.search = function (query, done) {
    internals.googleSearch(query, function (err, images) {
        if (err) {
            return done(new Error('No images found.'));
        }
//        internals.loadImage(images, 0, done);
    });
};