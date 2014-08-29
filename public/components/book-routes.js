'use strict';

angular.module('informer')

    .config(function ($stateProvider) {

        $stateProvider
            .state('books', {abstract: true, template: '<ui-view autoscroll="false"/>'})
            .state('books.home', {
                url: '/books',
                templateUrl: '/components/views/books-home-tpl.html',
                controller: 'BooksCtrl as ctrl'
            })
        ;

    })
;