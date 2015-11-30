/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

    .controller('orderDetailCtrl', function($http,$scope,OrderData,$location) {
      $scope.currentOrder = OrderData.getOrder();
      $scope.orderStatus = null;

      $scope.updateOrder = function(){
        $http.get('http://getmeher.com:3000/orders/' + $scope.currentShop._id +'/'+$scope.orderStatus).
        then(function (response) {
          alert("Order Updated!")
          $location.url("/app/activeorders/");
        }, function (response) {
          alert("Error occured. Pls try again!")
        });
      };

      $scope.acceptOrder = function(){
        alert("accepted");
        $scope.orderStatus = "accepted";
      };
      $scope.rejectOrder = function(){
        alert("Rejected");
        $scope.orderStatus = "rejected";
      };
    });