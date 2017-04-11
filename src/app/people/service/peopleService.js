(function(angular) {
  'use strict';
  /*
   *Service for getting a single store with its id
   */
  angular.module('petal.people')
    .service('peopleService', ["$http", "homeService", 'userLocationService', '$q',PeopleService]);

  /*
   * This servic has a function names getStore which takes id as parameter and returns a promise
   */
  function PeopleService($http, homeService, userLocationService,$q) {
    
    this.getAllUsers = getAllUsers;
    this.getRevealedUsers = getRevealedUsers;
    this.getNearbyUsers = getNearbyUsers;
    this.getRequestedUsers = getRequestedUsers;
    this.getReceivedUsers = getReceivedUsers;
    this.getNearbyUsers = getNearbyUsers;

    function getAllUsers(params) {
      params.all = true;
      return $http.get(homeService.baseURL + "user/getUsers", { params: params });

    }

    function getRevealedUsers(params) {
      params.revealed = true;
      return $http.get(homeService.baseURL + "user/getUsers", { params: params });

    }

    function getReceivedUsers(params) {
      params.received = true;
      return $http.get(homeService.baseURL + "user/getUsers", { params: params });

    }

    function getRequestedUsers(params) {
      params.requested = true;
      return $http.get(homeService.baseURL + "user/getUsers", { params: params });

    }

    function getNearbyUsers(params) {
      if(params.page===0){
        userLocationService.setUserLocation();
      }
      params.nearby = true;
      var defer = $q.defer();
      userLocationService.getUserLocation().then(function(position) {
        params.latitude = position.latitude;
        params.longitude = position.longitude;
        $http.get(homeService.baseURL + "user/getUsers", { params: params }).then(function(users) {
          defer.resolve(users);
        }).catch(function(err){
          defer.reject(err);
        });
      }).catch(function(err){
        defer.reject(err);
      });

      return defer.promise;
    }

    



  }
})(window.angular);
