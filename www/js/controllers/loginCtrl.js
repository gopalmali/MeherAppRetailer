/**
 * Created by chirag on 24/10/15.
 */
angular.module('starter.controllers')

    .controller('loginCtrl', function($scope, $ionicModal, $timeout, $window, $location, $http, $cordovaDevice,$ionicPlatform,$cordovaSQLite) {
      $scope.loginData={};
      window.db;
      $scope.loginData.deviceId = window.localStorage['deviceID'];
      //$ionicPlatform.ready(function () {
      //  $scope.loginData.deviceId = $cordovaDevice.getUUID();
      //  window.db = $cordovaSQLite.openDB("my.db");
      //  $cordovaSQLite.execute(window.db, "CREATE TABLE IF NOT EXISTS Meher_user (deviceID text, mobile integer,type text)");
      //  $scope.select($scope.loginData.deviceId);
      //});

      $scope.select = function(deviceId) {
        var query = "SELECT * FROM Meher_user WHERE deviceId = ?";
        $cordovaSQLite.execute(window.db,query,[deviceId]).then(function(result) {
          if(result.rows.length > 0) {
            window.meherUser=JSON.stringify(result.rows.item(0));
            alert(window.meherUser);
            window.mobile=JSON.stringify(result.rows.item(0).mobile);
            window.meherLoggedin= true;
          } else {
            window.meherLoggedin = false;
            //alert("NO ROWS EXIST");
          }
        }, function(error) {
          console.error(error);
        });
      };

      $scope.storeShop = function(_id,name,created,mobile,city,category,address,loc) {
        //{"_id":"56117cb75d95fd956471cce3","created":"2015-11-01T05:58:31.854Z","mobile":"9833617976","city":"Mumbai","category":"Grocery","loc":{"coordinates":[72.8490295277,19.2300433888],"type":"Point"},"address":"Shop No. 03, Om Sagar Apartment, Chandavarkar Road, Borivali West, Mumbai - 400092, Opposite Apex Hospital","phone":"+(91)-22-28902471, +(91)-9833617976","name":"Deepak General Stores"}
        $cordovaSQLite.execute(window.db, "CREATE TABLE IF NOT EXISTS Meher_store (_id text, name text,created text,mobile integer,city text, category text,address text, loc text)");

        var query = "INSERT INTO Meher_store (_id,name,created,mobile,city,category,address,loc) VALUES (?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute(window.db, query, [_id,name,created,mobile,city,category,address,loc]).then(function(res) {
          alert("insertId: " + res.insertId);
        }, function (err) {
          alert(err);
        });
      };

      $scope.sendOPT = function() {
        if(!$scope.loginData.mobile || !$scope.loginData.categoty)
        alert("please enter category & mobile number");
        else
        {
          console.log($scope.loginData.mobile.length)
          if($scope.loginData.mobile.length !== 10)
            alert("plese enter 10 DIGIT mobile number");
          else {
            window.localStorage['meherRetailMobile'] = $scope.loginData.mobile;
            $http.get('http://getmeher.com:3000/shop-groceries/mobile/' + $scope.loginData.mobile).
                then(function (response) {
                  if(response.data.length>0){
                    console.log(response.data)
                    window.localStorage['meherRetailShop'] = JSON.stringify(response.data[0]);
                    console.log("****")
                    console.log(window.localStorage['meherRetailShop']);
                  $location.url("/app/otp");
                  }else{
                    alert("no store registered with your number. Please register!");
                    $scope.login();
                  }
                }, function (response) {
                  alert("no store registered with your number. Please register!");
                  $scope.login();
                });
          }
        }
      };

      $scope.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.login = function() {
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        var body = JSON.stringify($scope.loginData);
        $window.location = "mailto:info@getmeher.com?subject=Add Store&body="+body;
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
      };
    });