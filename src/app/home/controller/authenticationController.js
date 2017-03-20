(function(angular) {
    'use strict';

    angular.module('petal.home')
        .controller("AuthenticationController", ["$scope", "$auth", "$state", "userData", AuthenticationController]);

    function AuthenticationController($scope, $auth, $state, userData) {
        var phc = this;
        console.log("authenticate");
        phc.isAuth = $auth.isAuthenticated();
        console.log(phc.isAuth);
        phc.authLogout = authLogout;

        phc.socialAuthenticate = socialAuthenticate;
        console.log($state);

        function socialAuthenticate(provider) {

            $auth.authenticate(provider).then(function(response) {
                console.log("from here");
                console.log(response);
                userData.setUser(response.data.user);
                alert('login with ' + provider + ' successfull');
                $state.go('home.post.all');
            }).catch(function(err){
                console.log("error");
                console.log(err);
            });
        }

        


        function authLogout() {
            $auth.logout();
            userData.removeUser();
            $state.go('authenticate');
        }
    }


})(window.angular);
