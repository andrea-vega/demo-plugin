'use strict';

angular.module('informer')

    .controller('ViewBookCtrl', function ($scope, book) {
        var ctrl = this;
        $scope.book = book;
        $scope.page = null;


        ctrl.currentImage = 1;
        ctrl.currentPage = 0;

        ctrl.prevPage = function () {
            ctrl.currentPage--;
            $scope.page = (ctrl.currentPage >= 0) && book.pages[ctrl.currentPage];
        };

        ctrl.nextPage = function () {
            ctrl.currentPage++;
            $scope.page = (ctrl.currentPage < book.pages.length) && book.pages[ctrl.currentPage];
        };

        ctrl.nextImage = function () {
            ctrl.currentImage++;
            if (ctrl.currentImage > $scope.book.images.length) {
                ctrl.currentImage = 1;
            }
            return $scope.book.images[ctrl.currentImage] || '';
        };

        _.forEach($scope.book.pages, function (page) {
            page.image = ctrl.nextImage();
        });

    });