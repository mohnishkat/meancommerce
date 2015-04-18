'use strict';

angular.module('mean.meancommerce').controller('CategoriesController', ['$scope', '$http', '$stateParams', '$location', '$modal', 'Global', 'Categories',
  function($scope, $http, $stateParams, $location, $modal, Global, Categories) {
    $scope.global = Global;
    $scope.hasAuthorization = function(category) {
      if (!category || !category.user) return false;
      return $scope.global.isAdmin || category.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var category = new Categories({
          name: this.name,
          slug: this.slug,
          content: this.content
        });
        category.$save(function(response) {
          $location.path('admin/categories/' + response._id);
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
          for (var i in $scope.categories) {
            if ($scope.categories[i] === category) {
	      $scope.categories.splice(i,1);
            }
          }
          $location.path('admin/categories');
        });
      } else {
        $scope.category.$remove(function(response) {
          $location.path('admin/categories');
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
          $location.path('admin/categories/' + category._id);
        }, function(error) {
           $scope.categoryError = error.data;
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Categories.query(function(categories) {
        $scope.categories = categories;
      });
    };

    $scope.findOne = function() {
      Categories.get({
        categoryId: $stateParams.categoryId
      }, function(category) {
        $scope.category = category;
      });
    };

    $scope.entityCreate = function(isValid, first) {
      if(first) {
        var modalInstance = $modal.open({
        templateUrl: 'meancommerce/views/admin/categories/entitycreate.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return 1;
          }
        }
        });
      }
      if (isValid) {
        var category = new Categories({
          name: this.name,
          slug: this.slug,
          content: this.content
        });
        category.$save(function(response) {
          Categories.get({
            categoryId: response._id
          }, function(category) {
            angular.element(document.getElementById('entity-list')).scope().categories.unshift(category);
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
    
    $scope.entityUpdate = function(isValid, category) {
      if (category) {
        var modalInstance = $modal.open({
          templateUrl: 'meancommerce/views/admin/categories/entityedit.html',
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
          var categories = angular.element(document.getElementById('entity-list')).scope().categories;
           angular.forEach(categories, function(value, key) {
            if(value._id == response._id){
              categories[key] = response;
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
      Categories.get({
        categoryId: categoryId
      }, function(category) {
        $scope.category = category;
      });
    };
    
    $scope.open = function ($event, category) {
      $event.preventDefault();
      var modalInstance = $modal.open({
        templateUrl: 'meancommerce/views/admin/categories/entityview.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          items: function () {
            return category;
          }
        }
      });
    };

    $scope.entityFindAll = function() {
      $http.get('/categories').success(function(data) {
        $scope.categories = data;
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
