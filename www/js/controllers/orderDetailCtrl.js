/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

    .controller('orderDetailCtrl', function($http,$scope,OrderData,$location) {
      $scope.currentOrder = OrderData.getOrder();
      if ($scope.currentOrder)
      $scope.currentOrder = {
        "store":{
          "_id":"561047b57d7fd0b85d723e88",
          "minimumOrderPrice":"200",
          "ourExperience":"3",
          "verified":true,
          "created":"2015-11-26T08:20:52.022Z",
          "closeTime":"10",
          "startTime":"10",
          "deliveryTime":"30",
          "deliveryDistance":"0.5",
          "mobile":"9820445984",
          "city":"Mumbai",
          "category":"fruits",
          "loc":{
            "coordinates":[
              72.835509,
              19.165909
            ],
            "type":"Point"
          },
          "address":"Ayappa Temple Rd, Goregaon West, Mumbai - 400062, Opp Jankalyan Bldg Bangur Nagar",
          "phone":"+(91)-9820445984",
          "name":"Suresh Gupta Fruit Vendor",
          "distance":0.36394783375889794
        },
        "orderStatus":"sent",
        "order":{
          "orderitem":[
            {
              "_id":"560d691af84c430f9b1e7e4d",
              "subtitle":"",
              "unit":"Kg",
              "created":"2015-11-28T08:33:50.124Z",
              "ImgFileName":"apple-143x143.jpg",
              "quantity":1,
              "price":160,
              "name":"Apple",
              "ordernow":true
            },
            {
              "_id":"560d691af84c430f9b1e7e4e",
              "subtitle":"",
              "unit":"Dozen",
              "created":"2015-12-01T06:55:05.940Z",
              "ImgFileName":"banana-143x143.jpg",
              "quantity":1,
              "price":40,
              "name":"Banana",
              "ordernow":true
            },
            {
              "_id":"560d691af84c430f9b1e7e4f",
              "subtitle":"",
              "unit":"Kg",
              "created":"2015-12-01T06:55:05.940Z",
              "ImgFileName":"papai-143x143.jpg",
              "quantity":1,
              "price":40,
              "name":"Papaya",
              "ordernow":true
            }
          ]
        },
        "customer":{
          "deviceId":"dedfede8201d4b0b",
          "addLine1":"new building",
          "addLine2":"Ram Nagar, Malad West, Mumbai, Maharashtra, India",
          "mobile":"9820272106"
        },
        "_id":"565d447c2dc552ef093c05e3",
        "__v":0,
        "user":null,
        "created":"2015-12-01T06:55:56.075Z"
      };

      //init all values
      $scope.grandTotal = 0;
      $scope.currentBlink = 0;
      $scope.orderStatus = $scope.currentOrder.orderStatus;
      $scope.shopCategory = window.localStorage['meherShopCategory'];

      $scope.acknowledgeOrder = function(product){
        if (product.available)
        $scope.grandTotal = $scope.grandTotal + product.price;
        else
          $scope.grandTotal = $scope.grandTotal - product.price;
        $scope.currentBlink = $scope.currentBlink +1;
      };

      $scope.updateOrder = function(){
        $http.put('http://getmeher.com:3000/orders/' + $scope.currentOrder._id +'/'+$scope.orderStatus,$scope.currentOrder).
        then(function (response) {
          alert("Order Updated!");
          $location.url("/app/activeorders");
        }, function (response) {
          alert("Error occured. Pls try again!")
        });
      };

      $scope.acceptOrder = function(){
        $scope.orderStatus = "accepted";
        $scope.updateOrder();
      };

      $scope.deliverySent = function(){
        $scope.orderStatus = "deliverySent";
        $scope.updateOrder();
      };

      $scope.rejectOrder = function(){
        $scope.orderStatus = "rejected";
        $scope.updateOrder();
      };
    });