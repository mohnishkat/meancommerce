'use strict';

/* jshint -W098 */
angular.module('mean.meancommerce').controller('MeancommerceController', ['$scope', 'Global', 'Meancommerce',
  function($scope, Global, Meancommerce) {
    $scope.global = Global;
    $scope.package = {
      name: 'meancommerce'
    };
  }
]);
