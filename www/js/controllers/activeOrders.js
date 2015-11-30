/**
 * Created by chirag on 24/10/15.
 */
angular.module('starter.controllers')

    .controller('activeOrdersCtrl', function($scope,$location,$http,OrderData) {

      if(window.localStorage['meherRetailShop']) {
        $scope.currentShop = JSON.parse(window.localStorage['meherRetailShop']);
      }
      else {
        $scope.checkLocalDB(window.localStorage['MeherDeviceId']);
      }

      $scope.checkLocalDB = function(deviceId) {
        var query = "SELECT * FROM Meher_store WHERE deviceId = ?";
        $cordovaSQLite.execute(db,query,[deviceId]).then(function(result) {
          if(result.rows.length > 0) {
            window.localStorage['meherRetailShop']=JSON.stringify(result.rows.item(0));
          } else {
            $location.path('/app/login');
            //alert("NO ROWS EXIST");
          }
        }, function(error) {
          console.error(error);
        });
      };


      //window.localStorage['meherRetailOrder'] = null;
      //$scope.currentShop = JSON.parse(window.localStorage['meherRetailShop']);
      //$scope.$on('$stateChangeSuccess', function() {
      //  if ($scope.currentShop == null)
      //  $location.path('/app/login');
      //});




      console.log(window.localStorage['meherRetailShop']);
      console.log(JSON.stringify($scope.currentShop));
      $http.get('http://getmeher.com:3000/orders/shop/' + $scope.currentShop._id).
      then(function (response) {
        if(response.data.length > 0)
          $scope.activeOrderLists = response.data;
        else{
          $scope.activeOrderLists = [
            {
              "store": {
                "_id": "565afc5b4d55c0e47eb0d0cc",
                "closeTime": "10",
                "startTime": "9",
                "deliveryTime": "30",
                "deliveryDistance": "1",
                "created": "2015-11-29T13:22:24.210Z",
                "mobile": "9833617976",
                "city": "Mumbai",
                "category": "Grocery",
                "loc": {
                  "coordinates": [
                    72.8490295277,
                    19.2300433888
                  ],
                  "type": "Point"
                },
                "address": "Shop No. 03, Om Sagar Apartment, Chandavarkar Road, Borivali West, Mumbai - 400092, Opposite Apex Hospital",
                "phone": "+(91)-22-28902471, +(91)-9833617976",
                "name": "Deepak General Stores",
                "distance": 0.03570295822958387
              },
              "orderStatus": "sent",
              "order": {
                "orderitem": [
                  {
                    "_id": "560e4764f84c430f9b1e7e7c",
                    "price": 215,
                    "quantity": 1,
                    "ImgFileName": "aashirvaad-atta-with-multi-grain-5kg-300x300-120x120.jpg",
                    "created": "2015-11-29T13:22:27.337Z",
                    "name": "Aashirvaad Atta With Multi Grain 5Kg",
                    "ordernow": true
                  }
                ]
              },
              "customer": {
                "devceId": "dedfede8201d4b0b",
                "addLine1": "Om Shanti Building",
                "addLine2": "Maharashtra Nagar, Borivali West, Mumbai, Maharashtra, India",
                "mobile": "982027771"
              },
              "_id": "565afc5b4d55c0e47eb0d0cc",
              "__v": 0,
              "user": null,
              "created": "2015-11-29T13:23:39.983Z"
            }]


        }
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
        OrderData.setOrder(order);
        $location.url("/app/orderdetail/"+order._id);
      };

    });
