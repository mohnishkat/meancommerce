'use strict';

//Categories service used for categories REST endpoint
angular.module('mean.meancommerce').factory('Categories', ['$resource',
  function($resource) {
    return $resource('/admin/categories/:categoryId', {
      categoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
