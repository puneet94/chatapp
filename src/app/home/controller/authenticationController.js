(function(angular) {
    'use strict';

    angular.module('petal.home')
        .controller("AuthenticationController", ["$scope", "$auth", "$state", "userData", AuthenticationController]);

    function AuthenticationController($scope, $auth, $state, userData) {
        var phc = this;
        phc.isAuth = $auth.isAuthenticated();
        if(phc.isAuth){
            $state.go('home.post.all');
        }
        phc.authLogout = authLogout;

        phc.socialAuthenticate = socialAuthenticate;

        function socialAuthenticate(provider) {
            $auth.authenticate(provider).then(function(response) {
                window.alert('login with ' + provider + ' successfull');
                userData.setUser(response.data.user);
                $state.go('home.post.all');
            }).catch(function(err){
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
