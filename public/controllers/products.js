'use strict';

angular.module('mean.meancommerce').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Global', 'Products',
  function($scope, $stateParams, $location, Global, Products) {
    $scope.global = Global;
    $scope.hasAuthorization = function(product) {
      if (!product || !product.user) return false;
      return $scope.global.isAdmin || product.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var product = new Products({
          name: this.name,
          slug: this.slug,
          content: this.content,
          sku: this.sku,
          price: this.price,
          category: this.category
        });
        product.$save(function(response) {
          $location.path('admin/products/' + response._id);
        }, function(error) {
           $scope.productError = error.data;
        });
        /*this.title = '';
        this.content = '';
        this.slug = '';*/
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(product) {
      if (product) {
        product.$remove(function(response) {
          for (var i in $scope.products) {
            if ($scope.products[i] === product) {
	      $scope.products.splice(i,1);
            }
          }
          $location.path('admin/products');
        });
      } else {
        $scope.product.$remove(function(response) {
          $location.path('admin/products');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var product = $scope.product;
        if(!product.updated) {
          product.updated = [];
        }
        product.updated.push(new Date().getTime());

        product.$update(function() {
          $location.path('admin/products/' + product._id);
        }, function(error) {
           $scope.productError = error.data;
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Products.query(function(products) {
        $scope.products = products;
      });
    };

    $scope.findOne = function() {
      Products.get({
        productId: $stateParams.productId
      }, function(product) {
        $scope.product = product;
      });
    };

    $scope.entityUpdate = function(isValid, product) {
      if (product) {
          $scope.entity_update = true;
          $scope.product = product;
      }
      if (isValid) {
        var product = $scope.product;
        if(!product.updated) {
          product.updated = [];
        }
        product.updated.push(new Date().getTime());

        product.$update(function() {
          $scope.productError = [{"param":"submit","msg":"Product has been updated"}];
        }, function(error) {
           $scope.productError = error.data;
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.entityUpdateClose = function() {
      $scope.entity_update = false;
      $scope.product = '';

      $scope.productError = '';
    };
	
	$scope.getProducts = function() {
      Products.query({
        category: $stateParams.categoryId
      }, function(products) {
        $scope.products = products;
      });
    };
  }
]);
