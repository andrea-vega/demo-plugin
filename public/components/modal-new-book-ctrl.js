'use strict';

angular.module('informer')

    .controller('NewBookCtrl', function ($scope, author, dataset, api, $timeout) {
        var ctrl = this;
        $scope.book = {
            author: author,
            datasetId: dataset,
            filter: {}
        };

        ctrl.dataset = dataset;

        ctrl.validate = function () {
            $scope.saving = false;
            angular.forEach($scope.newBookForm.$error, function (errorSet) {
                    angular.forEach(errorSet, function (node) {
                        node.$setViewValue(node.$modelValue);
                    });
                }
            );
            var valid = $scope.newBookForm.$valid;
            if (!valid) {
                $scope.testFailed = 'Please complete all required fields.';
            }
            return valid;
        };

        ctrl.save = function () {
            $scope.saving = true;
            api.link('inf:books').post($scope.book).then(function (result) {
                notify.success(result.title + ' was created.', 'Photo Book Created!');
                console.log(result);
                $scope.$hide();
            }, function (err) {
                $scope.saving = false;
                $scope.testPassed = false;
                $scope.testFailed = 'An error occurred: ' + (err.data ? err.data.message : err);
            });
        };

    });