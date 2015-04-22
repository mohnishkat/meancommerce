'use strict';

angular.module('mean.meancommerce').controller('ProductsController', ['$scope', '$http', '$stateParams', '$location', 'Global', 'Products',
  function($scope, $http, $stateParams, $location, Global, Products) {
    $scope.global = Global;
    $scope.hasAuthorization = function(product) {
      if (!product || !product.user) return false;
      return $scope.global.isAdmin || product.user._id === $scope.global.user._id;
    };

	$scope.quantity=[1,2,3,4,5];

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
      $scope.entity_update = false;
      $scope.entityClose();
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

    $scope.entityView = function($event, product) {
      $event.preventDefault();
      $scope.entityClose();
      if (product) {
          $scope.entity_view = true;
          $scope.product = product;
      }
    };

    $scope.entityCreate = function(isValid, first) {
      $scope.entityClose();
      $scope.entity_create = true;
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
          //$location.path('admin/products/' + response._id);
          //console.log(response);
          Products.get({
            productId: response._id
          }, function(product) {
            $scope.products.unshift(product);
          });
          $scope.entity_create = false;
        }, function(error) {
           $scope.productError = error.data;
        });
        /*this.title = '';
        this.content = '';
        this.slug = '';*/
      } else {
        $scope.submitted = true;
      }
      if(first){
        $scope.submitted = false;
      }
    };

    $scope.entityUpdate = function(isValid, product) {
      if (product) {
          $scope.entityClose();
          $scope.entity_update = true;
          $scope.product = product;
          $scope.cproduct = angular.copy($scope.product);
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

    $scope.entityCreateClose = function($event) {
        $event.preventDefault();
        $scope.entityClose();
    };

    $scope.entityUpdateClose = function($event) {
        $event.preventDefault();
        $scope.entityClose();
    };

    $scope.entityClose = function() {
      if($scope.entity_update){
        angular.forEach($scope.products, function(value, key) {
          //console.log($scope.cproduct);
          if(value._id == $scope.cproduct._id){
            $scope.products[key] = $scope.cproduct;
          }
        });
        $scope.productError = '';
        $scope.entity_update = false;
      }
      if($scope.entity_view){
        $scope.entity_view = false;
      }
      if($scope.entity_create){
        $scope.entity_create = false;
      }
    };
	
	$scope.getProducts = function() {
      //console.log($http);
	  $http.get('/category/products/'+$stateParams.categoryId).success(function(data) {
		$scope.products = data;
	 });
    };

  $scope.getProduct = function() {
   $http.get('/product/'+$stateParams.productId).success(function(data) {
		$scope.product = data;
	 });
  };

	$scope.addToCart = function(product) {
	  $http.post('/products/userCart',{productInfo:product,quantity:$scope.quantityValue}).success(function(data) {
		$scope.products = data;
	 });	 
    };

	$scope.getCartCount = function() {
	  $http.get('/products/userCartCount').success(function(data) {
		$scope.cartCount = data.length;
	 });
	 return $scope.cartCount;
    };

	$scope.getCartDetails = function() {
		$scope.cartTotal = 0;
		$http.get('/viewCart').success(function(data) {
			$scope.cartDetails = data.cartDetails;
			angular.forEach($scope.cartDetails, function(item) {
				$scope.cartTotal = $scope.cartTotal + ((item.product.price) * item.quantity);
			 });
		});
		//console.log($scope.cartTotal);
	};

    $scope.doPayment = function(cart) {
        $http.get('/destroyCart').success(function(data) {
		    $scope.checkoutSuccess = true;
	    });
    }
  }
]);
