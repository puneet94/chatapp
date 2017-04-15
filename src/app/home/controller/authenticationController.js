(function(angular) {
	'use strict';

	angular.module('petal.home')
		.controller("AuthenticationController", ["$scope", "$auth", "$state", "userData", 'userLocationService', '$ionicLoading','RequestsService', AuthenticationController]);

	function AuthenticationController($scope, $auth, $state, userData, userLocationService, $ionicLoading,RequestsService) {
		var phc = this;
		
		phc.isAuth = $auth.isAuthenticated();
		if (phc.isAuth) {
			$state.go('home.post.all');
		}
		phc.authLogout = authLogout;

		phc.socialAuthenticate = socialAuthenticate;

		function socialAuthenticate(provider) {
			$ionicLoading.show();
			$auth.authenticate(provider).then(function(response) {
				userData.setUser(response.data.user);
				userLocationService.setUserLocation();
				RequestsService.register();
				
				if (response.data.user.device_token) {
					$state.go('home.post.popular');
				} else {
					$state.go('home.userEditPage');
				}

			}).catch(function(err) {

				$ionicLoading.hide();
				window.alert(err);
			}).finally(function() {
				//$ionicLoading.hide();
			});
		}




		function authLogout() {
			$auth.logout();
			userData.removeUser();
			$state.go('authenticate');
		}
	}


})(window.angular);
