'use strict';

//Categories service used for categories REST endpoint
angular.module('mean.meancommerce').factory('Products', ['$resource',
  function($resource) {
    return $resource('/admin/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
