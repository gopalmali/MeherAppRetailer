/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

.factory('CartData', function () {

  var cartData = [];

  return {
    getCartItem: function () {
      return cartData.length;
    },
    setCartItem: function (firstName) {
      cartData.push(firstName);
    }
  };
});
