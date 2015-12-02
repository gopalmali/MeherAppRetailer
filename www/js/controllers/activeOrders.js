/**
 * Created by chirag on 24/10/15.
 */
angular.module('starter.controllers')

    .controller('activeOrdersCtrl', function($scope,$location,$http,OrderData,$cordovaSQLite,$ionicPlatform) {

      $scope.checkLocalDB = function(deviceId) {
        var query = "SELECT * FROM Meher_store WHERE deviceId = ?";
        $cordovaSQLite.execute(db,query,[deviceId]).then(function(result) {
          if(result.rows.length > 0) {
            window.localStorage['meherRetailShop']=JSON.stringify(result.rows.item(0));
            $scope.currentShop = JSON.parse(window.localStorage['meherRetailShop']);
            $scope.fetchStore();
          } else {
            $location.path('/app/login');
          }
        }, function(error) {
          console.error(error);
        });
      };
      $scope.initOrderList = function() {
        if (window.localStorage['meherRetailShop']._id) {
          $scope.currentShop = JSON.parse(window.localStorage['meherRetailShop']);
          $scope.fetchStore();
        }
        else {
          $scope.checkLocalDB(window.localStorage['MeherDeviceId']);
        }
      };

      $ionicPlatform.ready(function() {
        $scope.initOrderList();
      });


      $scope.fetchStore = function() {
        console.log(window.localStorage['meherRetailShop']);
        $http.get('http://getmeher.com:3000/orders/shop/' + $scope.currentShop._id).
        then(function (response) {
          if (response.data.length > 0)
            $scope.activeOrderLists = response.data;
          else {
            if (window.localStorage['meherShopCategory']=='shop-fruits')
            $scope.activeOrderLists = [{
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
            }];

            if (window.localStorage['meherShopCategory']=='shop-groceries')
            $scope.activeOrderLists = [{
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
                    "created": "2015-12-01T23:49:05.567Z",
                    "name": "Aashirvaad Atta With Multi Grain 5Kg",
                    "ordernow": true
                  },
                  {
                    "_id": "560eb50df84c430f9b1e8256",
                    "price": 10,
                    "quantity": 1,
                    "ImgFileName": "0dairymilk10-120x120.JPG",
                    "created": "2015-12-01T23:49:12.136Z",
                    "name": "Cadbury Dairy Milk Chocolate 14gm",
                    "ordernow": true
                  },
                  {
                    "_id": "560eb50df84c430f9b1e8254",
                    "price": 40,
                    "quantity": 1,
                    "ImgFileName": "0britarusk-120x120.JPG",
                    "created": "2015-12-01T23:49:12.136Z",
                    "name": "Britannia Premium Bake Rusk 300gm",
                    "ordernow": true
                  }
                ]
              },
              "customer": {
                "deviceId": "dedfede8201d4b0b",
                "addLine1": "Om Shanti Building",
                "addLine2": "Maharashtra Nagar, Borivali West, Mumbai, Maharashtra, India",
                "mobile": "980000000"
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
      };

      $scope.goToorder = function(order) {
        OrderData.setOrder(order);
        $location.url("/app/orderdetail/"+order._id);
      };

    });
