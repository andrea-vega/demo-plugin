'use strict';

var _ = require('lodash');
var imageSearch = require('googleapis').customsearch('v1');
var BPromise = require('bluebird');
var hoek = require('hoek');
var searchP = BPromise.promisify(imageSearch.cse.list);
var hapi = require('hapi');
var inflect = require('i')();

module.exports = function (Book, Dataset, esClient) {

    /**
     * Google image searches for pictures with the given query
     *
     * @param query A string to search for, i.e. "Asian scenery"
     * @returns {BPromise}
     */
    function findImages(query) {
        // auth is my personal google api key (set up through google developer site)
        // cx is the (required) custom search engine id  (set up through google custom search console)
        return searchP({
            q: query,
            searchType: 'image',
            safe: 'high',
            imgSize: 'xlarge',
            auth: 'AIzaSyCaLS8pZLHpjvLMbF6RJQ53WqDdFyFytmk',
            cx: '000578053474489133467:tfiodz3ku30'
        }).then(function (result) {
            return _.pluck(result[1].body.items, 'link');
        });
    }

    /**
     * Given a dataset, guess what is interesting and put it on the pages
     *
     * @param datasetId Slug of the dataset
     * @param filter the object to filter as in {Continent: 'Asia'}
     * @returns {BPromise} to the pages
     */
    function makePages(datasetId, filter) {
        return Dataset.findAsync({slug: datasetId})
            .then(function (dataset) {
                return getData(dataset[0], filter);
            })
            .then(function (result) {
                var aggs = result[0].aggregations;
                var pages = [];
                _.forEach(_.keys(aggs), function (group) {
                    pages.push({
                        group: group,
                        title: inflect.pluralize(inflect.titleize(group)),
                        items: aggs[group].buckets
                    });
                });
                return pages;
            });
    }

    /**
     * Choose the groups that will show up on the pages
     *
     * @param dataset The looked up dataset doc
     * @returns {Object} The aggregates part of the elastic search query
     */
    function chooseGroups(dataset) {
        var groups, aggs = {};
        groups = _.pluck(_.filter(dataset.fields, {type: 'string'}), 'name');
        _.forEach(groups, function (group) {
            if (probablyInteresting(group)) {
                aggs[group] = {'terms': {'field': group, 'size': 20}};
            }
        });
        return aggs;
    }

    /**
     * Guesses whether or not a group is interesting by eliminating key words such as "phone"
     *
     * @param fieldName The name of the field
     * @returns {boolean} True if probably an interesting group
     */
    function probablyInteresting(fieldName) {
        var group = fieldName && fieldName.toLowerCase();
        var interesting = !!group;
        if (interesting) {
            // Strings that wouldn't be interesting if grouped
            _.forEach(['phone', 'fax', 'email', 'street', 'code'], function (notInteresting) {
                if (_.contains(group, notInteresting)) {
                    interesting = false;
                    // does not return false to top level function
                    return false;
                }
            });
        }
        return interesting;
    }

    /**
     * Queries elastic search and gets back the interesting buckets
     *
     * @param dataset The dataset doc
     * @param filter The filter object as in { Continent: 'Asia' }
     * @returns {BPromise}
     */
    function getData(dataset, filter) {
        var query = {}, filter_term = {};
        filter_term[filter.group] = filter.value;
        query.index = 'informer-data';
        query.type = dataset._id.toString();
        query.body = {
            aggs: chooseGroups(dataset),
            size: 0,
            query: { term: filter_term }
        };
        console.log(query);
        return esClient.searchAsync(query);
    }

    /**
     * Makes the book, fills it out with images and data, and saves it to mongo
     *
     * @param options An object containing the necessary information to make a book
     * @returns {BPromise} A promise to deliver the book
     */
    function makeBook(options) {
        var book;

        options = hoek.applyToDefaults({
            blackAndWhite: false,
            extraKeywords: '',
            title: 'Book',
            author: 'Informer User',
            imageQuery: 'wallpaper',
            genre: 'Nonfiction',
            filter: {}
        }, options);

        // save the book first to make sure the title is unique before using google api quota
        return new Book({
            title: options.title,
            author: options.author,
            genre: options.genre
        }).saveAsync()
            .then(function (result) {
                book = result;
                return BPromise.props({
                    images: findImages(options.imageQuery),
                    pages: makePages(options.datasetId, options.filter)
                });
            })
            .then(function (result) {
                return hoek.merge(book, result).saveAsync();
            })
            .catch(function (err) {
                if (book) {
                    book.remove();
                }
                return hapi.error.badRequest('The book could not be created. ' + err);
            });
    }

    // the function that the create api will call
    return makeBook;

}
;