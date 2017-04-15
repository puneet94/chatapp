(function(angular){
'use strict';

/**
 * @ngdoc service
 * @name authModApp.userData
 * @description
 * # userData
 * Factory in the authModApp.
 */
angular.module('petal.home')
  .factory('userData',['$window','$state','$auth','$http','homeService',userData]);

  function userData($window,$state,$auth,$http,homeService) {
    var storage = $window.localStorage;
    var cachedUser={};
    var obj1 =  {
      setUser: function (user) {
        
        if(user){
          storage.setItem('user',JSON.stringify(user));
        }
        else{

          var userId = $auth.getPayload().sub;
          if(userId){
            return $http.get(homeService.baseURL+'user/get/'+userId).then(function(res){
              
              /*if(obj1.isUserExists()){
                  storage.removeItem('user');
              }*/
            
              storage.setItem('user',JSON.stringify(res.data));
            });
          }
        }
        

      },
      getUser: function(){

        return JSON.parse(storage.getItem('user'));
      },
      removeUser: function(){
        cachedUser = null;
        storage.removeItem('user');
      },
      isUserExists: function(){
        if(obj1.getUser()){
          return true;
        }
        return false;
      }
    };
    return obj1;
  }
})(window.angular);
