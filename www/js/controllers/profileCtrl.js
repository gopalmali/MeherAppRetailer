/**
 * Created by kanchan jewel on 11/30/2015.
 */

angular.module('starter.controllers')

    .controller('profileCtrl', function($scope,$http,$ionicPopup) {
      //var tempDeliveryDistance;
      $scope.tempDeliveryDistance;
      $scope.valueTempDeliveryDistance;
      $scope.processDistance= function(changedDistance){
        console.log($scope.tempDeliveryDistance)
        if( $scope.tempDeliveryDistance == 0) {
          $scope.valueTempDeliveryDistance=0.5;
        }
        else{
          $scope.valueTempDeliveryDistance= $scope.tempDeliveryDistance;
        }
        console.log($scope.valueTempDeliveryDistance)
      }

      $scope.showConfirm = function() {
        $ionicPopup.confirm({
          title: 'Conformation of details',
          template: 'Are you sure you want to save changes?'
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
          } else {
            console.log('You are not sure');
          }
        });
      };

      $scope.clicked = function(){
        alert("Clicked");
      };
      $http({
        method: 'GET',
       // url: 'http://example.com',
        url: 'https://api.myjson.com/bins/1tpaf'
      }).then(function successCallback(response) {
       // alert("Data Found")
        $scope.profileData=response.data;
        /*
        $scope.tempDeliveryDistance =parseInt($scope.profileData.deliveryDistance);
        if( $scope.tempDeliveryDistance==0) {
          $scope.valueTempDeliveryDistance=0.5;
        }
        else{
          $scope.valueTempDeliveryDistance= $scope.tempDeliveryDistance;
        }
        console.log($scope.tempDeliveryDistance)
*/
      }, function errorCallback(response) {
        alert("Data not Found");
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    });

