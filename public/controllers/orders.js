'use strict';

angular.module('mean.meancommerce').controller('OrdersController', ['$scope', '$http', '$stateParams', '$location', '$modal', 'Global', 'Orders',
  function($scope, $http, $stateParams, $location, $modal, Global, Orders) {
    $scope.global = Global;
    $scope.hasAuthorization = function(category) {
      if (!category || !category.user) return false;
      return $scope.global.isAdmin || category.user._id === $scope.global.user._id;
    };
	$scope.orderStatus=['processing','completed','on-hold','cancelled'];
    $scope.create = function(isValid) {
      if (isValid) {
        var category = new Orders({
          name: this.name,
          slug: this.slug,
          content: this.content
        });
        category.$save(function(response) {
          $location.path('admin/Orders/' + response._id);
        }, function(error) {
           $scope.categoryError = error.data;
        });
        /*this.title = '';
        this.content = '';
        this.slug = '';*/
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(category) {
      if (category) {
        category.$remove(function(response) {
          for (var i in $scope.Orders) {
            if ($scope.Orders[i] === category) {
	      $scope.Orders.splice(i,1);
            }
          }
          $location.path('admin/Orders');
        });
      } else {
        $scope.category.$remove(function(response) {
          $location.path('admin/Orders');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var category = $scope.category;
        if(!category.updated) {
          category.updated = [];
        }
        category.updated.push(new Date().getTime());

        category.$update(function() {
          $location.path('admin/Orders/' + category._id);
        }, function(error) {
           $scope.categoryError = error.data;
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
        categoryId: $stateParams.categoryId
      }, function(category) {
        $scope.category = category;
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
        var category = new Orders({
          name: this.name,
          slug: this.slug,
          content: this.content
        });
        category.$save(function(response) {
          Orders.get({
            categoryId: response._id
          }, function(category) {
            angular.element(document.getElementById('entity-list')).scope().Orders.unshift(category);
          });
          $scope.categoryError = [{"param":"submit","msg":"Category has been Created"}];
          $scope.name = '';
          $scope.content = '';
          $scope.slug = '';
        }, function(error) {
           $scope.categoryError = error.data;
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
              return category;
            }
          }
        });
      }
      if (isValid) {
        var category = $scope.category;
        if(!category.updated) {
          category.updated = [];
        }
        category.updated.push(new Date().getTime());

        category.$update(function(response) {
          $scope.categoryError = [{"param":"submit","msg":"Category has been updated"}];
          var Orders = angular.element(document.getElementById('entity-list')).scope().Orders;
           angular.forEach(Orders, function(value, key) {
            if(value._id == response._id){
              Orders[key] = response;
            }
          });
        }, function(error) {
           $scope.categoryError = error.data;
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.entityUpdateClose = function() {
      $scope.entity_update = false;
      $scope.category = '';

      $scope.categoryError = '';
    };
    
    $scope.entityFindOne = function(categoryId) {
      Orders.get({
        categoryId: categoryId
      }, function(category) {
        $scope.category = category;
      });
    };
    
    $scope.open = function ($event, category) {
      $event.preventDefault();
      var modalInstance = $modal.open({
        templateUrl: 'meancommerce/views/admin/Orders/entityview.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return category;
          }
        }
      });
    };

    $scope.entityFindAll = function() {
      $http.get('/Orders').success(function(data) {
        $scope.Orders = data;
      });
     };
    }
]).controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.category = items;


  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function ($event) {
    $event.preventDefault();
    $modalInstance.dismiss('cancel');
  };
});
