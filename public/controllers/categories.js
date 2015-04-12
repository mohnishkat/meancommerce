'use strict';

angular.module('mean.meancommerce').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Global', 'Categories',
  function($scope, $stateParams, $location, Global, Categories) {
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

    $scope.entityUpdate = function(isValid, category) {
      if (category) {
          $scope.entity_update = true;
          $scope.category = category;
      }
      if (isValid) {
        var category = $scope.category;
        if(!category.updated) {
          category.updated = [];
        }
        category.updated.push(new Date().getTime());

        category.$update(function() {
          $scope.categoryError = [{"param":"submit","msg":"Category has been updated"}];
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
  }
]);
