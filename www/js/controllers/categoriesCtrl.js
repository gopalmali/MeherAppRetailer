/**
 * Created by chirag on 30/09/15.
 */
angular.module('starter.controllers')

    .controller('CategoriesCtrl', function($scope,$location,$http) {
      $scope.categorylists = [];
      $scope.categorylists = [
        {
          "title": "Grocery",
          "subtitle": "Instantly order bread,butter,biscuits",
          "image": "img/grocery.jpg",
          "id": "Grocery",
          "link": "shop-groceries",
          "type": "general",
          "productCategory": [
            {
              "title": "Grocery",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "groceries",
              "imagefolder": "images-groceries"
            },
            {
              "title": "Packet Food",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "packetfoods",
              "imagefolder": "packetfoods"
            },
            {
              "title": "Personal Care",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "personalcares",
              "imagefolder": "personalcares"
            },
            {
              "title": "House Hold",
              "products": [

              ],
              "pageNumber": 1,
              "loadMore": true,
              "link": "households",
              "imagefolder": "households"

            }
          ]
        },
        {
          "title": "Fruits",
          "subtitle": "Get Fresh Fruits in minutes",
          "image": "img/fruits.png",
          "id": "Fruits",
          "link": "shop-fruits",
          "type": "general",
          "productCategory": [
            {
              "title": "Fruits",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "fruits",
              "imagefolder": "fruits"
            },
            {
              "title": "vegetables",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "vegetables",
              "imagefolder": "vegetables"
            },
            {
              "title": "leafy vegetables",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "leafyvegetables",
              "imageolder": "leafyvegetables"
            },
            {
              "title": "Sprouts",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "sproutsvegetables",
              "imageolder": "sproutsvegetables"

            }
          ]
        },
        {
          "title": "Restaurants",
          "subtitle": "Order your favorite food right now!",
          "image": "img/resturant.png",
          "id": "Restaurants",
          "type": "restaurants",
          "productCategory": [
          ]
        },
        {
          "title": "Electronics",
          "subtitle": "Get best deal on mobile,TV from local shops",
          "image": "img/electronic.png",
          "id": 4,
          "link": "shop-electronics",
          "type": "general",
          "productCategory": [
            {
              "title": "Fruits",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "fruits",
              "imageolder": "fruits"
            },
            {
              "title": "vegetables",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "vegetables",
              "imageolder": "vegetables"
            },
            {
              "title": "leafy vegetables",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "leafyvegetables",
              "imageolder": "leafyvegetables"
            },
            {
              "title": "Sprouts",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "sproutsvegetables",
              "imageolder": "sproutsvegetables"

            }
          ]
        },
        {
          "title": "Pharmacy",
          "subtitle": "Order medicine from local chemist",
          "image": "img/pharmacy.png",
          "id": 6,
          "link": "shop-medicals",
          "type": "none",
          "productCategory": [
          ]
        }
      ];

      //$http({
      //  method: 'GET',
      //  url: 'http://getmeher.com:3000/categorylists'
      //}).then(function successCallback(response) {
      //  console.log(response)
      //  if (response.data.length> 0)
      //  $scope.categorylists = response.data;
      //  else
      //    alert("unable to connect");
      //}, function errorCallback(response) {
      //  console.log(response)
      //  alert("unable to connect");
      //});


      $scope.goToStoreList = function(category) {
        window.category = category;
        $location.url("/app/categories/"+category.id);
      };

    })
