'use strict';

angular.module('informer')

    .controller('ViewBookCtrl', function ($scope, book) {
        var ctrl = this;
        ctrl.book = book;
    });