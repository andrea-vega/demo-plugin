'use strict';

angular.module('informer')

    .factory('modalNewBook', function ($modal) {
        return $modal({templateUrl: '/components/views/modal-new-book-tpl.html', controller: 'NewBookCtrl as ctrl'});
    })

    .factory('modalViewBook', function ($modal) {
        return $modal({templateUrl: '/components/views/modal-view-book-tpl.html', controller: 'ViewBookCtrl as ctrl'});
    })

;