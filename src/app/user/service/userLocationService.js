(function(angular){
  'use strict';
/*
  *Service for getting a single store with its id
*/
angular.module('petal.user')
  .service('userLocationService',['$cordovaGeolocation','userService',UserLocationService]);

/*
  * This servic has a function names getStore which takes id as parameter and returns a promise
*/
function UserLocationService($cordovaGeolocation,userService){
  this.getUserLocation = getUserLocation;
  function getUserLocation(){
    var options = { timeout: 10000, enableHighAccuracy: false };
    return $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      var positions = {latitude:position.coords.latitude, longitude:position.coords.longitude};
      userService.updateUser(positions);    
      return positions;
      });    
  }
  



}
})(window.angular);
