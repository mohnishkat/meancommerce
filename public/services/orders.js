'use strict';

//Orders service used for orders REST endpoint
angular.module('mean.meancommerce').factory('Orders', ['$resource',
  function($resource) {
    return $resource('/admin/orders/:orderId', {
      orderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
