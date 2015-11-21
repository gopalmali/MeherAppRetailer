/**
 * Created by chirag on 19/09/15.
 */
angular.module('starter.controllers')

    .controller('orderCtrl', function($scope, $http, $stateParams,CartData,StoreData,$ionicPopup,$timeout,$cordovaSms,$location,$window,$cordovaSQLite) {
      //$scope.cartList=CartData.getCart();
      $scope.cartMsg="";
      $scope.cartItems = CartData.getCart();
      $scope.StoreSelected = StoreData.getStore();
      $scope.formData = {};
      $scope.formData.userAddress = "";
      $scope.formData.userSublocality = $window.subLocality.formatted_address;
      $scope.orderPost={};
      $scope.showDelete=false;
      $scope.addnotAvailble=false;

      var db = $cordovaSQLite.openDB("my1.db");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Meher_user (deviceID text, mobile integer,type text,addLine1 text,addLine2 text)");




      $scope.$on("$ionicView.enter", function () {
        console.log("!!!!!!!!! dekho");
        console.log(CartData.getCart());
        $scope.cartItems = CartData.getCart();
        $scope.cartTotal = $scope.getCartTotal();
      });

      $scope.$watchCollection('cartItems', function(newValue, oldValue) {
        if (newValue !== oldValue)
        {
          console.log("watch triggered !!");
          CartData.setCart(newValue);
          $scope.cartTotal = $scope.getCartTotal();
        }
      });

      $scope.$on('composeSMS', function(event) {
        console.log("recieved it");
        $scope.sendSMS();
      });

      $scope.onDeleteItem = function(item,key) {
        console.log($scope.cartItems)
        $scope.cartItems.splice(key, 1);
        console.log($scope.cartItems)
        //CartData.setCart($scope.cartItems);
      }

      $scope.toggleShowDelete = function() {
        $scope.showDelete= !$scope.showDelete;
      }

        $scope.updateCart = function(productItem) {
        $scope.cartItems = $scope.cartItems.filter(function( obj ) {
          //console.log(obj);
          if (obj.name == productItem.name)
          {
            console.log(obj);
            obj.quantity = productItem.quantity;
            obj.price = productItem.price;
          }
          return obj;
        });
        console.log($scope.cartItems);
        CartData.copyCart($scope.cartItems);
        $scope.cartTotal = $scope.getCartTotal();
      }

      $scope.increaseQuantity = function(productItem) {
        if (productItem.quantity > 1){
          productItem.price = productItem.price + (productItem.price /productItem.quantity);
          productItem.quantity = productItem.quantity + 1;
        }
        else{
          productItem.quantity = productItem.quantity + 1;
          productItem.price = productItem.price * productItem.quantity ;
        }
        $scope.updateCart(productItem)
      }

        $scope.decreaseQuantity = function(productItem) {
        if (productItem.quantity > 1){
          productItem.price = productItem.price - (productItem.price /productItem.quantity);
          productItem.quantity = productItem.quantity - 1;
          $scope.updateCart(productItem)
        }
      }

      $scope.getCartTotal = function() {
        var total = 0;
        console.log($scope.cartItems);
        //CartData.setCart($scope.cartItems)
        angular.forEach($scope.cartItems, function(item){
          console.log(item);
          if ($scope.cartItems.length > 0 && item.price)
            total = total + (item.price);
          else
            total =0
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

      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Enter Address',
          template: 'Please enter your Address'
        });
        alertPopup.then(function(res) {
          console.log("closed");
          //document.getElementById("house-address").focus();
          focus('house-address');
        });
      };

      $scope.retriveLocal = function() {
        var query = "SELECT * FROM Meher_user WHERE deviceId = ?";
        $cordovaSQLite.execute(db,query,[window.localStorage['deviceID']]).then(function(result) {
          if(result.rows.length > 0) {
            $scope.localUserMobile=JSON.stringify(result.rows.item(0).mobile);
            $scope.localUserMobile=JSON.stringify(result.rows.item(0).mobile);
            window.meherLoggedin= true;
            $scope.sendSMS();
          } else {
            window.meherLoggedin = false;
            alert("new user");
            $location.url("/app/login");
            //alert("NO ROWS EXIST");
          }
        }, function(error) {
          console.error(error);
        });
      };


      $scope.saveLocally = function() {
        //alert("saving");
      }



      $scope.sendSMS = function() {


        console.log($scope.formData.userAddress);
        $scope.cartMsg ="";
        if ($scope.formData.userAddress) {
          $scope.saveLocally()
          angular.forEach($scope.cartItems, function (value, key) {
            if(value.quantity){
              $scope.cartMsg = $scope.cartMsg + value.quantity;
              if (value.unit)
                $scope.cartMsg = $scope.cartMsg + value.unit + " " + value.name + "-" + "\n";
              else
                $scope.cartMsg = $scope.cartMsg  + " " + value.name + "-" + "\n";
            }
            else
              $scope.cartMsg = $scope.cartMsg + '-'+value.name + "-" + "\n";
          });
          $scope.cartMsg = $scope.cartMsg + "Address:" + "\n";
          $scope.cartMsg = $scope.cartMsg + $scope.formData.userAddress + "\n" + $scope.formData.userSublocality;
          $scope.orderPost.store = $scope.StoreSelected;
          $scope.orderPost.order = {
            orderitem:$scope.cartItems
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


          $scope.orderPost.customer = {
            id:"OrderUser",
            mobile:$scope.localUserMobile,
            Address:$scope.formData.userAddress + ", " + $scope.formData.userSublocality
          };

          console.log("******");
          console.log($scope.orderPost);

          $http({
            url: 'http://getmeher.com:3000/orders',
            method: "POST",
            data: $scope.orderPost
          }).then(function(response) {
                // success
                alert("orderSentToServe");
                console.log(response);
              },
              function(response) { // optional
                // failed
                console.log(response);
              });

          $scope.cartMsg = $scope.cartMsg +'\n'+"Ordered Using Meher App - https://goo.gl/cxqKEc";
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
        }
        else{
          console.log("got it");
          $scope.showAlert();

        }
      }
    });
