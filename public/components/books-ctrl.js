'use strict';

angular.module('informer')

    .controller('BooksCtrl', function ($scope, books, modalViewBook) {
        var ctrl = this;
        ctrl.books = books;
        ctrl.viewBook = function (book) {
            modalViewBook.open({ book: book });
        };
    })
;

