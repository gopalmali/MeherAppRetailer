/**
 * Created by chirag on 24/10/15.
 */
angular.module('starter.controllers')

    .controller('loginCtrl', function($scope, $ionicPopup, $timeout, $window, $location, $cordovaSms,$http, $cordovaDevice,$ionicPlatform,$cordovaSQLite) {
        $scope.loginData={};
        window.db;
        $scope.loginData = {};
        $scope.loginData.deviceId = window.localStorage['deviceID'];
        $scope.loginData.opt = null;
        $scope.orderPost = JSON.parse(window.localStorage['orderPost']);
        $scope.cartMsg = JSON.parse(window.localStorage['currentOrder']);
        $scope.opt;
        if ($scope.loginData.mobile){
            $scope.otpRequested = true;
        }
        else {
            $scope.otpRequested = false;
        }

        //$ionicPlatform.ready(function () {
        //  $scope.loginData.deviceId = $cordovaDevice.getUUID();
        //  window.db = $cordovaSQLite.openDB("my.db");
        //  $cordovaSQLite.execute(window.db, "CREATE TABLE IF NOT EXISTS Meher_user (deviceID text, mobile integer,type text)");
        //  //$scope.select($scope.loginData.deviceId);
        //});

        //$scope.select = function(deviceId) {
        //  var query = "SELECT * FROM Meher_user WHERE deviceId = ?";
        //  $cordovaSQLite.execute(window.db,query,[deviceId]).then(function(result) {
        //    if(result.rows.length > 0) {
        //      window.meherUser=JSON.stringify(result.rows.item(0));
        //      window.mobile=JSON.stringify(result.rows.item(0).mobile);
        //      window.meherLoggedin= true;
        //      $location.url("/app/activeorders");
        //    } else {
        //      window.meherLoggedin = false;
        //      //alert("NO ROWS EXIST");
        //    }
        //  }, function(error) {
        //    console.error(error);
        //  });
        //};

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

        $scope.fillMobileAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Enter Mobile',
                template: 'plese enter 10 DIGIT mobile number'
            });
            alertPopup.then(function (res) {
            });
        };

        $scope.optAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Incorrect OTP',
                template: 'Please enter correct OTP send in SMS'
            });
            alertPopup.then(function (res) {
            });
        };

        $scope.makeUser = function () {
            //alert("saving");
            //retrive local data
            alert($scope.orderPost.customer);
            alert($scope.orderPost["customer"]);
            $scope.orderPost["customer"]["mobile"] = window.localStorage['MeherMobile'];
            console.log("******");
            console.log($scope.orderPost);

            $http({
                url: 'http://getmeher.com:3000/orders',
                method: "POST",
                data: $scope.orderPost
            }).then(function (response) {
                    // success
                    alert("orderSentToServe");
                    console.log(response);
                },
                function (response) { // optional
                    // failed
                    console.log(response);
                });

            $scope.cartMsg = $scope.cartMsg + '\n' + "Ordered Using Meher App - https://goo.gl/cxqKEc";
            console.log($scope.cartMsg);

            document.addEventListener("deviceready", function () {
                $cordovaSms
                    .send($scope.orderPost.store.mobile, $scope.cartMsg, options)
                    .then(function () {
                        //alert('Sending Order');
                        // Success! SMS was sent
                        $location.url("/app/postorder");
                    }, function (error) {
                        alert(error);
                        // An error occurred

                    });
            });
        };

        $scope.saveUser = function() {
            $scope.orderPost = JSON.parse(window.localStorage['orderPost']);
            $scope.cartMsg = JSON.parse(window.localStorage['currentOrder']);
            alert(JSON.stringify($scope.orderPost, null, 4));
            window.localStorage['MeherMobile'] = $scope.loginData.mobile;
            if ($scope.orderPost){
                $scope.makeUser();
            }
        };

        $scope.verifiedOtp = function() {
                if ($scope.opt == $scope.loginData.opt)
                    $scope.saveUser();
                else {
                    $scope.optAlert();
                }
        };

        $scope.backToLogin = function() {
            $scope.otpRequested = !$scope.otpRequested;
        };

        $scope.sendOPT = function() {
            if (!$scope.loginData.mobile || $scope.loginData.mobile.length !== 10) {
                $scope.fillMobileAlert();
            }
            else {
                window.localStorage['userMobile'] = $scope.loginData.mobile;
                $scope.opt = Math.floor(Math.random() * 9000) + 1000;
                alert($scope.opt);
                $scope.otpRequested = true;
                //console.log($scope.storeAccount);
                //if ($scope.storeAccount){
                //    $scope.sendStoreOPT();
                //}
                //else{
                //    $scope.sendUserOPT();
                //}
            }
        };



        //$scope.sendOPT = function() {
        //  window.localStorage['userMobile'] = $scope.loginData.mobile;
        //  console.log($scope.storeAccount);
        //  if ($scope.storeAccount){
        //    $scope.sendStoreOPT();
        //  }
        //  else{
        //    $scope.sendUserOPT();
        //  }
        //}

        $scope.sendUserOPT = function() {
            if(!$scope.loginData.mobile || $scope.loginData.mobile.length !== 10)
                alert("plese enter 10 DIGIT mobile number");
            else{
                window.localStorage['meherUserMobile'] = $scope.loginData.mobile;
                $location.url("/app/otp");
            }
        };

        $scope.sendStoreOPT = function() {
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


    });