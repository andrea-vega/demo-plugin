'use strict';

angular.module('informer')

    .directive('clippy', function ($timeout, modalNewBook, api) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/components/views/clippy-tpl.html',
            link: function (scope) {

                // If on report results page, prepare for clippy!!!
                scope.$on('$stateChangeSuccess', function (event, toState) {
                    if (toState && toState.name === 'reports.detail.results') {
                        $timeout(function () {
//                            scope.wassairClippy = true;
                        }, 2000);
                    }
                });

                // Oh you totally want a photo book.
                scope.totally = function () {
                    modalNewBook.open({ author: scope.session.user.displayName, dataset: api.get('inf:dataset', {id: scope.$stateParams.id})});
                    scope.wassairClippy = false;
                };

                // Fine, I'll go
                scope.goAway = function () {
                    scope.wassairClippy = false;
                };

                $timeout(scope.totally, 1000);
            }
        };
    })

    .directive('clippyHimself', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div clippy-dances><img src="/images/clippy.png"</div>'
        };
    })

    .directive('clippyDances', function ($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                var dance;
                var animations = ['bounce', 'wobble', 'rubberBand', 'shake', 'swing', 'tada'];

                element.addClass('animated');

                function randomDance() {
                    return animations[_.random(0, animations.length - 1)];
                }

                function danceClippy() {
                    element.addClass(dance = randomDance());
                    $timeout(function () {
                        holdStill();
                    }, attrs.danceFrequency || 4000);
                }

                function holdStill() {
                    element.removeClass(dance);
                    $timeout(function () {
                        danceClippy();
                    }, 500);
                }

                danceClippy();
            }
        };
    })
;

$('body').append('<clippy></clippy>');