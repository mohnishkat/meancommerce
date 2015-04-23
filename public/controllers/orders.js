'use strict';

angular.module('mean.meancommerce').controller('OrdersController', ['$scope', '$http', '$stateParams', '$location', '$modal', 'Global', 'Orders',
  function($scope, $http, $stateParams, $location, $modal, Global, Orders) {
    $scope.global = Global;
    $scope.hasAuthorization = function(order) {
      if (!order || !order.user) return false;
      return $scope.global.isAdmin || order.user._id === $scope.global.user._id;
    };
	$scope.orderStatus=['processing','completed','on-hold','cancelled'];
    $scope.create = function(isValid) {
      if (isValid) {
        var order = new Orders({
          name: this.name,
          slug: this.slug,
          content: this.content
        });
        order.$save(function(response) {
          $location.path('admin/Orders/' + response._id);
        }, function(error) {
           $scope.orderError = error.data;
        });
        /*this.title = '';
        this.content = '';
        this.slug = '';*/
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(order) {
      if (order) {
        order.$remove(function(response) {
          for (var i in $scope.Orders) {
            if ($scope.Orders[i] === order) {
	      $scope.Orders.splice(i,1);
            }
          }
          $location.path('admin/Orders');
        });
      } else {
        $scope.order.$remove(function(response) {
          $location.path('admin/Orders');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var order = $scope.order;
        if(!order.updated) {
          order.updated = [];
        }
        order.updated.push(new Date().getTime());

        order.$update(function() {
          $location.path('admin/Orders/' + order._id);
        }, function(error) {
           $scope.orderError = error.data;
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Orders.query(function(Orders) {
        $scope.orders = Orders;
      });
    };

    $scope.findOne = function() {
      Orders.get({
        orderId: $stateParams.orderId
      }, function(order) {
        $scope.order = order;
      });
    };

    $scope.entityCreate = function(isValid, first) {
      if(first) {
        var modalInstance = $modal.open({
        templateUrl: 'meancommerce/views/admin/Orders/entitycreate.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return 1;
          }
        }
        });
      }
      if (isValid) {
        var order = new Orders({
          name: this.name,
          slug: this.slug,
          content: this.content
        });
        order.$save(function(response) {
          Orders.get({
            orderId: response._id
          }, function(order) {
            angular.element(document.getElementById('entity-list')).scope().Orders.unshift(order);
          });
          $scope.orderError = [{"param":"submit","msg":"Category has been Created"}];
          $scope.name = '';
          $scope.content = '';
          $scope.slug = '';
        }, function(error) {
           $scope.orderError = error.data;
        });
      } else {
        $scope.submitted = true;
      }
    };
    
    $scope.entityUpdate = function(isValid, order) {
      if (order) {
        var modalInstance = $modal.open({
          templateUrl: 'meancommerce/views/admin/orders/entityedit.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function () {
              return order;
            }
          }
        });
      }
      if (isValid) {
        var order = $scope.order;
        if(!order.updated) {
          order.updated = [];
        }
        order.updated.push(new Date().getTime());

        order.$update(function(response) {
          $scope.orderError = [{"param":"submit","msg":"Category has been updated"}];
          var Orders = angular.element(document.getElementById('entity-list')).scope().Orders;
           angular.forEach(Orders, function(value, key) {
            if(value._id == response._id){
              Orders[key] = response;
            }
          });
        }, function(error) {
           $scope.orderError = error.data;
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.entityUpdateClose = function() {
      $scope.entity_update = false;
      $scope.order = '';

      $scope.orderError = '';
    };
    
    $scope.entityFindOne = function(orderId) {
      Orders.get({
        orderId: orderId
      }, function(order) {
        $scope.order = order;
      });
    };
    
    $scope.open = function ($event, order) {
      $event.preventDefault();
      var modalInstance = $modal.open({
        templateUrl: 'meancommerce/views/admin/orders/entityview.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return order;
          }
        }
      });
    };

    $scope.entityFindAll = function() {
      $http.get('/orders').success(function(data) {
        $scope.Orders = data;
      });
     };
    }
]).controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.order = items;


  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function ($event) {
    $event.preventDefault();
    $modalInstance.dismiss('cancel');
  };
});
