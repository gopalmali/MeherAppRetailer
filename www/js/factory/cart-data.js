/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

.factory('CartData', function () {

  var cartData = [];

  return {
    getCart: function () {
      return cartData;
    },
    setCart: function (cartList) {
       cartData = angular.copy(cartList);
      return cartData;
    },

    copyCart: function (cartList) {
      cartData = angular.copy(cartList);
      return cartData;
    },

    getCartItem: function () {
      return cartData.length;
    },
    setCartItem: function (firstName) {
      cartData.push(firstName);
    }
  };
});
