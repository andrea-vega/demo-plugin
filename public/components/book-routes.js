'use strict';

angular.module('informer')

    .config(function ($stateProvider) {

        var booksApi = {
            books: ['api', function (api) {
                return api.link('inf:books').first().get().get('inf:book').all();
            }],
            book: ['api', '$stateParams', function (api, $stateParams) {
                return api.get('inf:book', {id: $stateParams.id});
            }]
        };

        $stateProvider
            .state('books', {abstract: true, template: '<ui-view autoscroll="false"/>'})
            .state('books.home', {
                url: '/books',
                templateUrl: '/components/views/books-home-tpl.html',
                controller: 'BooksCtrl as ctrl',
                resolve: {
                    books: booksApi.books
                }
            })
        ;

    })
;