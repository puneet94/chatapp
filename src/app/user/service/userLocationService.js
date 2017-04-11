(function(angular) {
  'use strict';
  /*
   *Service for getting a single store with its id
   */
  angular.module('petal.user')
    .service('userLocationService', ['$cordovaGeolocation', 'userService', UserLocationService]);

  /*
   * This servic has a function names getStore which takes id as parameter and returns a promise
   */
  function UserLocationService($cordovaGeolocation, userService) {
    this.getUserLocation = getUserLocation;
    this.setUserLocation = setUserLocation;

    function getUserLocation() {
      var options = { timeout: 10000, enableHighAccuracy: true };
      return $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        return positions;
      });
    }

    function setUserLocation() {
      var options = { timeout: 10000, enableHighAccuracy: true };
      $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        userService.updateUser(positions);
      });
    }




  }
})(window.angular);
