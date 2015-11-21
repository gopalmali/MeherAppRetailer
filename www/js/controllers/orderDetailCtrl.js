/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

    .controller('orderDetailCtrl', function($scope) {
      console.log(JSON.parse(window.localStorage['meherRetailOrder']));
      $scope.currentOrder = JSON.parse(window.localStorage['meherRetailOrder']);
    });