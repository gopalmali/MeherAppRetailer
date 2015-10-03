/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

    .controller('storeCtrl', function($scope, $http, $stateParams,CartData,StoreData,$ionicLoading,$ionicSlideBoxDelegate) {

      $scope.storelistId = ($stateParams.storelistId);
      $scope.storeId = ($stateParams.storeId);
      $scope.cartItems = CartData.getCart();
      $scope.StoreSelected = StoreData.getStore();
      $scope.StoreDistance = StoreData.getStoreDistance();
      $scope.customProduct = {};
      $scope.storeCategory = window.category;
      $scope.productCatalog = window.category.productCategory;

      $scope.$watchCollection('cartItems', function(newValue, oldValue) {
        if (newValue !== oldValue)
        {
          CartData.setCart(newValue);
        }
      });


      $scope.updateCart = function(productItem) {
        console.log("UPDATE!!!!!!!!")
        $scope.cartItems = $scope.cartItems.filter(function( obj ) {
          //console.log(obj);
          if (obj.$$hashKey == productItem.$$hashKey)
          {
            console.log(obj);
            obj.quantity = productItem.quantity;
            obj.price = productItem.price;
          }
          return obj;
        });
        CartData.copyCart($scope.cartItems);
        console.log(CartData.getCart());
      }

      $scope.increaseQuantity = function(productItem) {
        if (productItem.quantity > 0){
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
      $scope.addcustomProduct = function() {
        var matches = true;
        var message = "";
        angular.forEach($scope.cartItems, function(item) {
          if (item.customQuantity)
            if ($scope.customProduct.name === item.name && $scope.customProduct.customQuantity === item.customQuantity) {
              matches = false;
              message = 'You have already selected to withdraw this item!';
            }
        });

        // add item to collection
        if (matches != false) {
          $scope.cartItems.push($scope.customProduct);
          message = 'Item Added!';
          $scope.customProduct ={};
        }
        $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
        console.log($scope.cartItems);
      }

      $scope.addToCart = function(productItem,checkStatus,index) {
        if(checkStatus){
          console.log("adding")
          $scope.cartItems.push(productItem);
          console.log(CartData.getCart());
        }
        else{
          console.log("removing")
          if (productItem.quantity>1){
            productItem.price = productItem.price / productItem.quantity;
            productItem.quantity =1;
          }
          $scope.cartItems = $scope.cartItems.filter(function( obj ) {
            return obj.$$hashKey !== productItem.$$hashKey;
          });
          //CartData.copyCart($scope.cartItems);
          console.log(CartData.getCart());
        }
      };


      //$scope.loadAllProducts = function(productCategory,pageNumber,index) {
      //  $scope.getProducts(productCategory,pageNumber).then(function (response) {
      //    angular.forEach(response.data, function(value, key) {
      //      $scope.productCatalog[index].products.push(value);
      //    });
      //    $scope.productCatalog[index].pageNumber ++;
      //  })
      //  $scope.$broadcast('scroll.infiniteScrollComplete');
      //};


      $scope.scrollCheck = function(index) {
        if ($ionicSlideBoxDelegate.selected() == index && $scope.productCatalog[$ionicSlideBoxDelegate.selected()].loadMore == true){
          return true;
        }
        else{
          return false;
        }
      }

      var once = true;
      $scope.loadMoreProducts = function() {
        if($scope.productCatalog[$ionicSlideBoxDelegate.selected()])
        if(once == true && $scope.productCatalog[$ionicSlideBoxDelegate.selected()].loadMore == true) {
          once=false;
          var index = $ionicSlideBoxDelegate.selected();
          var productCategory = $scope.productCatalog[index].link;
          var pageNumber = $scope.productCatalog[index].pageNumber
          $scope.getProducts(productCategory, pageNumber).then(function (response) {
            if (response.data.length >0 ){
              angular.forEach(response.data, function (value, key) {
                $scope.productCatalog[index].products.push(value);
              });
              $scope.productCatalog[index].pageNumber++;
            }
            else{
              $scope.productCatalog[index].loadMore = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            once = true;
          })
        }
      };

      $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMoreProducts();
      });


      $scope.getProducts = function(productCategory,pageNumber) {
        return $http.get('http://getmeher.com:3000/'+productCategory+'/'+'page'+'/'+pageNumber)
      };


      /*$scope.productCatalog = [
       {
       "CaterogyName": "Fruits",
       "pageNumber":1,
       "products": [
       {
       name: "Apple",
       image: "http://icons.iconarchive.com/icons/mirella-gabriele/fruits/32/apple-icon.png",
       price:120,
       quantity:1,
       unit:"Kg"
       },
       {
       "name": "Mango",
       "image": "http://icons.iconarchive.com/icons/artbees/paradise-fruits/32/Mango-icon.png",
       "price":400,
       quantity:1,
       unit:"Dozen"
       }
       ]
       },
       {
       "CaterogyName": "Vegetables",
       "pageNumber":1,
       "products": [
       {
       name: "Tamato",
       image: "",
       price:30,
       quantity:1,
       unit:"Kg"
       },
       {
       "name": "Patato",
       "image": "",
       "price":20,
       quantity:1,
       unit:"Kg"
       }
       ]
       }]*/

    });