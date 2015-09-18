/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

    .controller('storeCtrl', function($scope, $http, $stateParams,CartData) {

      $scope.storelistId = ($stateParams.storelistId);
      $scope.storeId = ($stateParams.storeId);

      $scope.cartItems=[];
      $scope.cartItemsNumbers= CartData.getCartItem();
      $scope.$watch('cartItemsNumbers', function (newValue, oldValue) {
        if (newValue !== oldValue) CartData.setCartItem(newValue);
      });

      $scope.addToCart = function(productItem,checkStatus) {
        if(checkStatus){$scope.cartItemsNumbers = $scope.cartItemsNumbers + 1;}
        else{$scope.cartItemsNumbers = $scope.cartItemsNumbers - 1;}
        console.log(productItem);
        $scope.cartItems.push(productItem)
      };

      $scope.productCatalog = [
        {
          "name": "Fruits",
          "products": [
            {
              name: "Apple",
              image: "http://icons.iconarchive.com/icons/mirella-gabriele/fruits/32/apple-icon.png",
              price:120,
              quantity:"1",
              unit:"Kg"
            },
            {
              "name": "Mango",
              "image": "http://icons.iconarchive.com/icons/artbees/paradise-fruits/32/Mango-icon.png",
              "price":400,
              quantity:"1",
              unit:"Dozen"
            }
          ]
        },
        {
          "name": "Vegetables",
          "products": [
            {
              name: "Tamato",
              image: "",
              price:30,
              quantity:"1",
              unit:"Kg"
            },
            {
              "name": "Patato",
              "image": "",
              "price":20,
              quantity:"1",
              unit:"Kg"
            }
          ]
        }]

    });