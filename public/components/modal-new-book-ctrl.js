'use strict';

angular.module('informer')

    .controller('NewBookCtrl', function ($scope, author, dataset, api, notify, modalViewBook) {
        var ctrl = this;
        $scope.book = {
            author: author,
            datasetId: dataset.slug,
            filter: {}
        };

        ctrl.dataset = dataset;

        ctrl.validate = function () {
            $scope.saving = false;
            $scope.error = false;
            angular.forEach($scope.newBookForm.$error, function (errorSet) {
                    angular.forEach(errorSet, function (node) {
                        node.$setViewValue(node.$modelValue);
                    });
                }
            );
            var valid = $scope.newBookForm.$valid;
            if (!valid) {
                $scope.error = 'Please complete all required fields.';
            }
            return valid;
        };

        ctrl.save = function () {
            $scope.saving = true;
            api.link('inf:books').post($scope.book).then(function (result) {
                notify.success(result.title + ' was created.', 'Photo Book Created!');
                modalViewBook.open({ book: result });
                $scope.$hide();
            }, function (err) {
                $scope.saving = false;
                $scope.error = 'An error occurred: ' + (err.data ? err.data.message : err);
            });
        };

    });