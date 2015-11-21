/**
 * Created by chirag on 24/10/15.
 */
angular.module('starter.controllers')

    .controller('activeOrdersCtrl', function($scope,$location,$http) {

      window.localStorage['meherRetailOrder'] = null;
      $scope.currentShop = JSON.parse(window.localStorage['meherRetailShop']);
      $scope.$on('$stateChangeSuccess', function() {
        if ($scope.currentShop == null)
        $location.path('/app/activeorders');
      });

      console.log(window.localStorage['meherRetailShop']);
      console.log(JSON.stringify($scope.currentShop));
      $http.get('http://getmeher.com:3000/orders/shop/' + $scope.currentShop._id).
          then(function (response) {
            console.log(response);
            $scope.activeOrderLists = response.data;
          }, function (response) {
            alert("no store registered with your number. Please register")
          });

      //$scope.activeOrderLists = [
      //  {
      //    "user": "9820272106",
      //    "address": "B-401",
      //    "itemTotal":3,
      //    "status": "unread"
      //  },
      //  {
      //    "user": "9820272106",
      //    "address": "B-401",
      //    "itemTotal":7,
      //    "status": "unread"
      //  },
      //  {
      //    "user": "9820272106",
      //    "address": "B-401",
      //    "itemTotal":2,
      //    "status": "unread"
      //  }
      //];

      $scope.goToorder = function(order) {
        console.log(order);
        window.localStorage['meherRetailOrder']=null;
        window.localStorage['meherRetailOrder'] = JSON.stringify(order);
        console.log(JSON.parse(window.localStorage['meherRetailOrder']));
        $location.url("/app/orderdetail/"+order.user);
      };

    });
