'use strict';

angular.module('mean.meancommerce').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('meancommerce example page', {
      url: '/meancommerce/example',
      templateUrl: 'meancommerce/views/index.html',
			resolve: {
        loggedin: checkLoggedin
			}
    });

    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };


    // states for my app
    $stateProvider
      .state('all categories', {
        url: '/admin/categories',
        templateUrl: 'meancommerce/views/admin/categories/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create category', {
        url: '/admin/categories/create',
        templateUrl: 'meancommerce/views/admin/categories/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit category', {
        url: '/admin/categories/:categoryId/edit',
        templateUrl: 'meancommerce/views/admin/categories/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('category by id', {
        url: '/admin/categories/:categoryId',
        templateUrl: 'meancommerce/views/admin/categories/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });

  }
]);
