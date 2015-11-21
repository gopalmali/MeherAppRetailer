/**
 * Created by chirag on 24/10/15.
 */
angular.module('starter.controllers')

    .controller('otpCtrl', function($scope, $location,$cordovaSQLite) {
      $scope.currentMobile = JSON.parse(window.localStorage['meherRetailMobile']);
      $scope.currentShop = JSON.parse(window.localStorage['meherRetailShop']);

      $scope.execute = function(deviceID,mobile,type) {
        var query = "INSERT INTO Meher_user (deviceID, mobile,type) VALUES (?,?,?)";
        $cordovaSQLite.execute(window.db, query, [deviceID, mobile, type]).then(function(res) {
          alert("insertId: " + res.insertId);
        }, function (err) {
          alert(err);
        });
      };

      $scope.verifiedLogin = function() {
        var type;
        if ($scope.currentShop)
          type = "store";
        else
          type = "store";
        var deviceID =  (window.localStorage['deviceID']);
        var mobile = $scope.currentMobile;
        $scope.execute(deviceID,mobile,type);
        $location.url("/app/activeorders");
      };
    });