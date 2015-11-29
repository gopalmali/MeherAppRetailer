/**
 * Created by chirag on 19/09/15.
 */
angular.module('starter.controllers')

    .controller('orderCtrl', function ($scope, $http, $stateParams, CartData, StoreData, $ionicPopup, $timeout, $cordovaSms, $location, $window, $cordovaSQLite, $rootScope, $ionicPlatform) {
        //$scope.cartList=CartData.getCart();
        $scope.cartMsg = "";
        $scope.cartItems = CartData.getCart();
        $scope.StoreSelected = StoreData.getStore();
        $scope.formData = {};
        $scope.formData.userAddress = "";
        $scope.formData.userSublocality = $window.subLocality.formatted_address;
        $scope.orderPost = {};
        $scope.showDelete = false;
        $scope.addnotAvailble = false;
        window.localStorage['MeherUser'];
        window.localStorage['MeherMobile'];
        window.localStorage['MeherMobile'] = null;
        var db;

        $ionicPlatform.ready(function () {
            db = $cordovaSQLite.openDB("my.db");
            var query = "CREATE TABLE IF NOT EXISTS Meher_user (deviceID text, mobile integer,type text,addLine1 text,addLine2 text)";
            $cordovaSQLite.execute(db, query).then(function (res) {
                $scope.checkLocalDB();
            }, function (err) {
            });
        });

        $scope.checkLocalDB = function () {
            if (window.localStorage['MeherUser'])
                alert("before checking go user" + window.localStorage['MeherUser']);
            var query = "SELECT * FROM Meher_user WHERE addLine2 = ?";
            $cordovaSQLite.execute(db, query, $scope.formData.userSublocality).then(function (result) {
                if (result.rows.length > 0) {
                    window.localStorage['MeherUser'] = JSON.stringify(result.rows.item(0));
                    window.localStorage['MeherMobile'] = JSON.stringify(result.rows.item(0).mobile);
                    $scope.formData.userAddress = JSON.stringify(result.rows.item(0).addLine1);
                }
            }, function (error) {
                console.error(error);
            });
        };


        $scope.$on("$ionicView.enter", function () {
            console.log(CartData.getCart());
            $scope.cartItems = CartData.getCart();
            $scope.cartTotal = $scope.getCartTotal();
        });

        $scope.$watchCollection('cartItems', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                console.log("watch triggered !!");
                CartData.setCart(newValue);
                $scope.cartTotal = $scope.getCartTotal();
            }
        });


        $scope.onDeleteItem = function (item, key) {
            console.log($scope.cartItems);
            $scope.cartItems.splice(key, 1);
            console.log($scope.cartItems);
            //CartData.setCart($scope.cartItems);
        };

        $rootScope.$on("CallDelete", function () {
            $scope.toggleShowDelete();
        });

        $scope.toggleShowDelete = function () {
            $scope.showDelete = !$scope.showDelete;
        };

        $scope.updateCart = function (productItem) {
            $scope.cartItems = $scope.cartItems.filter(function (obj) {
                //console.log(obj);
                if (obj.name == productItem.name) {
                    console.log(obj);
                    obj.quantity = productItem.quantity;
                    obj.price = productItem.price;
                }
                return obj;
            });
            console.log($scope.cartItems);
            CartData.copyCart($scope.cartItems);
            $scope.cartTotal = $scope.getCartTotal();
        };

        $scope.increaseQuantity = function (productItem) {
            if (productItem.quantity > 1) {
                productItem.price = productItem.price + (productItem.price / productItem.quantity);
                productItem.quantity = productItem.quantity + 1;
            }
            else {
                productItem.quantity = productItem.quantity + 1;
                productItem.price = productItem.price * productItem.quantity;
            }
            $scope.updateCart(productItem)
        };

        $scope.decreaseQuantity = function (productItem) {
            if (productItem.quantity > 1) {
                productItem.price = productItem.price - (productItem.price / productItem.quantity);
                productItem.quantity = productItem.quantity - 1;
                $scope.updateCart(productItem)
            }
        };

        $scope.getCartTotal = function () {
            var total = 0;
            console.log($scope.cartItems);
            //CartData.setCart($scope.cartItems)
            angular.forEach($scope.cartItems, function (item) {
                console.log(item);
                if ($scope.cartItems.length > 0 && item.price)
                    total = total + (item.price);
                else
                    total = 0
            })
            return total;
        };

        $scope.cartTotal = $scope.getCartTotal();


        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //intent: '' // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
                intent: 'INTENT' // send SMS inside a default SMS app
            }
        };

        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Enter Address',
                template: 'Please enter your Address'
            });
            alertPopup.then(function (res) {
                console.log("closed");
                //document.getElementById("house-address").focus();
                focus('house-address');
            });
        };

        $scope.retriveLocal = function () {
            if ($scope.formData.userAddress) {
                $scope.makeOrder();
                //if (!angular.isObject(window.localStorage['MeherMobile'])){
                ////if (window.localStorage['MeherMobile'] !== null || window.localStorage['MeherMobile'] !==undefined){
                //	alert("gottach here" + window.localStorage['MeherMobile']);
                //	//$scope.makeUser();
                //}
                if (true) {
                    var query = "SELECT * FROM Meher_user WHERE deviceId = ?";
                    $cordovaSQLite.execute(db, query, [window.localStorage['deviceID']]).then(function (result) {
                        if (result.rows.length > 0) {
                            window.localStorage['MeherUser'] = JSON.stringify(result.rows.item(0));
                            window.localStorage['MeherMobile'] = JSON.stringify(result.rows.item(0).mobile);
                            //window.meherLoggedin = true;
                            //$scope.makeOrder();
                        } else {
                            $scope.saveOrdergotoLogin();
                            //window.localStorage['orderPost'] = $scope.orderPost;
                            //window.localStorage['currentOrder'] = $scope.cartMsg;
                            //alert(window.localStorage['currentOrder']);
                            //alert(window.localStorage['orderPost']);
                            //
                            //console.log(window.localStorage['currentOrder']);
                            //console.log(window.localStorage['orderPost']);
                            //console.log(window.localStorage['meherUserMobile']);
                            //
                            ////window.meherLoggedin = false;
                            //alert("new user going to login");
                            //$location.url("/app/login");
                            ////alert("NO ROWS EXIST");
                        }
                    }, function (error) {
                        console.error(error);
                    });
                }
            }
            else {
                $scope.showAlert();
            }
        };


        $scope.saveLocally = function () {
            //alert("saving");
        };

        $scope.saveOrdergotoLogin = function () {
            window.localStorage['orderPost'] = JSON.stringify($scope.orderPost);
            window.localStorage['currentOrder'] = JSON.stringify($scope.cartMsg);
            $location.url("/app/login");
        };

        $scope.makeUser = function () {
            //alert("saving");
            //retrive local data

            $scope.orderPost.customer.mobile = window.localStorage['MeherMobile'];
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
                    .send($scope.StoreSelected.mobile, $scope.cartMsg, options)
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


        $scope.makeOrder = function () {
            console.log($scope.formData.userAddress);
            $scope.cartMsg = "";
            //$scope.saveLocally()
            angular.forEach($scope.cartItems, function (value, key) {
                if (value.quantity) {
                    $scope.cartMsg = $scope.cartMsg + value.quantity;
                    if (value.unit)
                        $scope.cartMsg = $scope.cartMsg + value.unit + " " + value.name + "\n";
                    else
                        $scope.cartMsg = $scope.cartMsg + " " + value.name + "\n";
                }
                else
                    $scope.cartMsg = $scope.cartMsg + '-' + value.name + "\n";
            });
            $scope.cartMsg = $scope.cartMsg + "Address:" + "\n";
            $scope.cartMsg = $scope.cartMsg + $scope.formData.userAddress + "\n" + $scope.formData.userSublocality;
            $scope.orderPost.store = $scope.StoreSelected;
            $scope.orderPost.orderStatus = "sent";
            $scope.orderPost.order = {
                orderitem: $scope.cartItems
            };

            $scope.orderPost.customer = {
                devceId: window.localStorage['deviceID'],
                addLine1: $scope.formData.userAddress,
                addLine2: $scope.formData.userSublocality
            };

            // retrive from local db
            //query = *
            //$cordovaSQLite.execute  ()
            //      { window.meherUsserMobile = result.rows.item(0).mobile}
            // if (result.rows.item(0).addLine1)
            //      { window.meherUsseradress = result.rows.item(0).addLine1}
            //      formData.userAddress = window.meherUsseradress
            // if (result.rows.item(0).addLine1)
            //      { window.meherUsseradress = result.rows.item(0).addLine2}

            //
            //$scope.orderPost.customer = {
            //  id:"OrderUser",
            //  mobile:$scope.localUserMobile,
            //  Address:$scope.formData.userAddress + ", " + $scope.formData.userSublocality
            //};
            //
            //console.log("******");
            //console.log($scope.orderPost);
            //
            //$http({
            //  url: 'http://getmeher.com:3000/orders',
            //  method: "POST",
            //  data: $scope.orderPost
            //}).then(function(response) {
            //      // success
            //      alert("orderSentToServe");
            //      console.log(response);
            //    },
            //    function(response) { // optional
            //      // failed
            //      console.log(response);
            //    });
            //
            //$scope.cartMsg = $scope.cartMsg +'\n'+"Ordered Using Meher App - https://goo.gl/cxqKEc";
            //console.log($scope.cartMsg);
            //
            //document.addEventListener("deviceready", function () {
            //  $cordovaSms
            //      .send($scope.StoreSelected.mobile, $scope.cartMsg, options)
            //      .then(function () {
            //           //alert('Sending Order');
            //        // Success! SMS was sent
            //        $location.url("/app/postorder");
            //      }, function (error) {
            //        alert(error);
            //        // An error occurred
            //
            //      });
            //});
        };
    });
