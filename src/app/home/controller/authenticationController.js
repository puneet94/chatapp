(function(angular) {
    'use strict';

    angular.module('petal.home')
        .controller("AuthenticationController", ["$scope", "$auth", "$state", "userData", 'userLocationService','$ionicLoading',AuthenticationController]);

    function AuthenticationController($scope, $auth, $state, userData,userLocationService,$ionicLoading) {
        var phc = this;
        $ionicLoading.hide();
        phc.isAuth = $auth.isAuthenticated();
        if(phc.isAuth){
            $state.go('home.post.all');
        }
        phc.authLogout = authLogout;

        phc.socialAuthenticate = socialAuthenticate;

        function socialAuthenticate(provider) {
            $ionicLoading.show();
            $auth.authenticate(provider).then(function(response) {
                
                userData.setUser(response.data.user);
                userLocationService.getUserLocation().then(function(){}).catch(function(err){
                    $ionicLoading.hide();
                    window.alert(JSON.stringify(err));
                }).finally(function(){
                    //$ionicLoading.hide();
                    $state.go('home.post.nearby');    
                });
                
            }).catch(function(err){
                $ionicLoading.hide();
                window.alert(JSON.stringify(err));
            });
        }

        


        function authLogout() {
            $auth.logout();
            userData.removeUser();
            $state.go('authenticate');
        }
    }


})(window.angular);
