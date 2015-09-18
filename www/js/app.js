// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','greatCircles',])

app.directive('googleplace', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      var options = {
        types: ['geocode'],
        componentRestrictions: {}
      };
      scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
      google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
        scope.$apply(function() {
          var place = scope.gPlace.getPlace();
          console.log(place.geometry.location.lat(),place.geometry.location.lng());
          //model.$setViewValue(element.val());
          model.$setViewValue(place);
        });
      });
    }
  };
})


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider

          .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
          })

          .state('app.browse', {
            url: '/browse',
            views: {
              'menuContent': {
                templateUrl: 'templates/browse.html'
              }
            }
          })
          .state('app.categories', {
            url: '/categories',
            views: {
              'menuContent': {
                templateUrl: 'templates/categories.html',
                controller: 'CategoriesCtrl'
              }
            }
          })

          .state('app.storelist', {
            url: '/categories/:storelistId',
            views: {
              'menuContent': {
                templateUrl: 'templates/storelist.html',
                controller: 'StorelistCtrl'
              }
            }
          })
          .state('app.store', {
            url: '/categories/:storelistId/:storeId',
            views: {
              'menuContent': {
                templateUrl: 'templates/store.html',
                controller: 'storeCtrl'
              }
            }
          });

      //.state('app.singleStore', {
      //  url: '/categories/:storelistId',
      //  views: {
      //    'menuContent': {
      //      templateUrl: 'templates/storelist.html',
      //      controller: 'StorelistCtrl'
      //    }
      //  }
      //});

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/categories');
    });

