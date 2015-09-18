angular.module('starter.controllers', [])

    .controller('LoadCtrl', function($scope, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, ionPlatform, $http,CartData) {
      $scope.notifications = [];
      $scope.cart=CartData.getCartItem();

      $scope.$watch(function () { return CartData.getCartItem(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.cart = newValue;
      });

      // call to register automatically upon device ready
      ionPlatform.ready.then(function (device) {
        //alert(device);
        $scope.register();
      });


      // Register
      $scope.register = function () {
        var config = null;

        if (ionic.Platform.isAndroid()) {
          console.log("iconic"+ionic.Platform);
          console.log("iconic"+ionic.Platform);

          config = {
            "senderID": "181306712234" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
          };
        }
        else if (ionic.Platform.isIOS()) {
          config = {
            "badge": "true",
            "sound": "true",
            "alert": "true"
          }
        }

        $cordovaPush.register(config).then(function (result) {
          console.log("Register success " + result);

          $cordovaToast.showShortCenter('Registered for push notifications');
          $scope.registerDisabled=true;
          // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
          if (ionic.Platform.isIOS()) {
            $scope.regId = result;
            storeDeviceToken("ios");
          }
        }, function (err) {
          console.log("Register error " + err)
        });
      }

      // Notification Received
      $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        console.log(JSON.stringify([notification]));
        if (ionic.Platform.isAndroid()) {
          handleAndroid(notification);
        }
        else if (ionic.Platform.isIOS()) {
          handleIOS(notification);
          $scope.$apply(function () {
            $scope.notifications.push(JSON.stringify(notification.alert));
          })
        }
      });

      // Android Notification Received Handler
      function handleAndroid(notification) {
        // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
        //             via the console fields as shown.
        console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
        if (notification.event == "registered") {
          $scope.regId = notification.regid;
          storeDeviceToken("android");
        }
        else if (notification.event == "message") {
          $cordovaDialogs.alert(notification.message, "Push Notification Received");
          $scope.$apply(function () {
            $scope.notifications.push(JSON.stringify(notification.message));
          })
        }
        else if (notification.event == "error")
          $cordovaDialogs.alert(notification.msg, "Push notification error event");
        else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
      }

      // IOS Notification Received Handler
      function handleIOS(notification) {
        // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
        // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
        // the notification when this code runs (weird).
        if (notification.foreground == "1") {
          // Play custom audio if a sound specified.
          if (notification.sound) {
            var mediaSrc = $cordovaMedia.newMedia(notification.sound);
            mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
          }

          if (notification.body && notification.messageFrom) {
            $cordovaDialogs.alert(notification.body, notification.messageFrom);
          }
          else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

          if (notification.badge) {
            $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
              console.log("Set badge success " + result)
            }, function (err) {
              console.log("Set badge error " + err)
            });
          }
        }
        // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
        // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
        // the data in this situation.
        else {
          if (notification.body && notification.messageFrom) {
            $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
          }
          else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
        }
      }

      // Stores the device token in a db using node-pushserver (running locally in this case)
      //
      // type:  Platform type (ios, android etc)
      function storeDeviceToken(type) {
        // Create a random userid to store with it
        var onSuccess = function(position) {
          window.currentLoc = position;
          var user = { user: 'Auser ' + position.coords.latitude +'-'+position.coords.longitude , type: type, token: $scope.regId };
          //alert("Post token for registered device with data " + JSON.stringify(user));
          //Log.d("meher" , "Post token for registered device with data")

          $http.post('http://getmehere.in:8000/subscribe', JSON.stringify(user))
              .success(function (data, status) {
                //alert("yes done")
                console.log("Token stored, device is successfully subscribed to receive push notifications.");
                //alert("Token stored, device is successfully subscribed to receive push notifications.");
              })
              .error(function (data, status) {
                //alert("no not done")
                console.log("Error storing device token." + data + " " + status)
                //alert("Error storing device token." + data + " " + status)
              }
          );

        };

// onError Callback receives a PositionError object
//
        function onError(error) {}

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

      }

      // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
      // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
      // time the app opens which this currently does. However in many cases you will always receive the same device token as
      // previously so multiple userids will be created with the same token unless you add code to check).
      function removeDeviceToken() {
        var tkn = {"token": $scope.regId};
        $http.post('http://getmehere.in:8000/unsubscribe', JSON.stringify(tkn))
            .success(function (data, status) {
              console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
              alert("Token removed, device is successfully unsubscribed and will not receive push notifications.");
            })
            .error(function (data, status) {
              console.log("Error removing device token." + data + " " + status)
              alert("Error removing device token." + data + " " + status)
            }
        );
      }

      // Unregister - Unregister your device token from APNS or GCM
      // Not recommended:  See http://developer.android.com/google/gcm/adv.html#unreg-why
      //                   and https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/index.html#//apple_ref/occ/instm/UIApplication/unregisterForRemoteNotifications
      //
      // ** Instead, just remove the device token from your db and stop sending notifications **
      $scope.unregister = function () {
        console.log("Unregister called");
        Log.d("meher" , "Unregister called")

        alert("Unregister called");
        removeDeviceToken();
        $scope.registerDisabled=false;
        //need to define options here, not sure what that needs to be but this is not recommended anyway
//        $cordovaPush.unregister(options).then(function(result) {
//            console.log("Unregister success " + result);//
//        }, function(err) {
//            console.log("Unregister error " + err)
//        });
      }


    })





    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      // Form data for the login modal
      $scope.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
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

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
      };
    })

    .controller('CategoriesCtrl', function($scope) {
      $scope.categorylists = [
        { title: 'Grocery',subtitle: 'Instantly order bread, butter, biscuits', image:'http://www.iconshock.com/img_jpg/BRILLIANT/shopping/jpg/128/grocery_shop_icon.jpg', id: "Grocery" },
        { title: 'Fruits', subtitle: 'Get Fresh Fruits in minutes', image:'http://icons.iconseeker.com/png/fullsize/market/fruits.png' ,id: 'Fruits' },
        { title: 'Restaurants', subtitle: 'Order your favorite food right now!', image:'http://icons.iconarchive.com/icons/jamespeng/cuisine/128/Pork-Chop-Set-icon.png', id: 'Restaurants' },
        { title: 'Electronics',subtitle: 'Get best deal on mobile, TV from local shops', image:'http://icons.iconarchive.com/icons/mcdo-design/smooth-leopard/128/Sidebar-TV-or-Movie-icon.png',id: 4 },
        { title: 'Clothes', subtitle: 'Check latest trending clothes nearby', image:'http://icons.iconarchive.com/icons/scoyo/badge/128/Shop-Clothes-icon.png', id: 5},
        { title: 'Pharmacy', subtitle: 'Order medicine from local chemist', image:'http://icons.iconarchive.com/icons/aha-soft/medical/128/Drug-basket-icon.png', id: 6},
      ];
    })

    .controller('StorelistCtrl', function($scope, $http, $stateParams) {
      $scope.areaLat = 0;
      $scope.areaLng = 0;
      $scope.storelistId = ($stateParams.storelistId);
      function locName(lat,lng) {
        $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng).
            then(function(response) {
              console.log(response.data.results[0].formatted_address);
              //$scope.location = (response.data.results[0].formatted_address);
              var arrAddress = response.data.results;
              // iterate through address_component array
              angular.forEach(arrAddress, function (address_component,index) {
                //if (address_component.types[0] == "locality") // locality type
                //{
                var locality = (address_component.address_components[0].types); // here's your town name
                console.log(locality)
                if(locality.indexOf("sublocality_level_2") > -1 || locality.indexOf("sublocality_level_2") > -1 || locality.indexOf("sublocality_level_3") > -1 || locality.indexOf("establishment") > -1) {
                  $scope.location = (address_component.formatted_address);
                  return false; // break the loop
                //
                }
              });
              fetchStoreList(lat,lng);
            }, function(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });

      }

      var onSuccess = function(position) {
        console.log(position.coords.latitude +'-'+position.coords.longitude);
        $scope.areaLat=position.coords.latitude;
        $scope.areaLng=position.coords.longitude;
        locName($scope.areaLat,$scope.areaLng)
      };

// onError Callback receives a PositionError object
//
      function onError(error) {
        console.log("error")
      }
      if (window.currentLoc){
        console.log(window.currentLoc)
        $scope.areaLat=window.currentLoc.coords.latitude;
        $scope.areaLng=window.currentLoc.coords.longitude;
        locName($scope.areaLat,$scope.areaLng);
      }
      else{
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }

      function fetchStoreList(lat,lng) {

        $http.get('https://api.myjson.com/bins/v00s').
            then(function (response) {
              $scope.storeList = response.data;
              console.log(response.data)
            }, function (response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
      }
      $scope.distanceTo = function(store) {
        var distance = GreatCircle.distance( store.loc.coordinates[0],store.loc.coordinates[1], $scope.areaLat, $scope.areaLng)
        store.distance = distance;
        distance = distance.toFixed(1);
        return distance;
      };

    });