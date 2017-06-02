(function(angular) {
	'use strict';

	angular.module('petal.home')
		.controller("AuthenticationController", ["$scope", "$auth", "$state", "userData", 'userLocationService', '$ionicLoading', 'RequestsService', '$ionicModal', AuthenticationController]);

	function AuthenticationController($scope, $auth, $state, userData, userLocationService, $ionicLoading, RequestsService, $ionicModal) {
		var phc = this;

		phc.isAuth = $auth.isAuthenticated();
		if (phc.isAuth) {
			$state.go('home.post.all');
		}
		if (window.cordova) {
			phc.webSignIn = true;
		}
		phc.authLogout = authLogout;
		phc.loadPostModal = loadPostModal;


		phc.socialAuthenticate = socialAuthenticate;
		$scope.googleSignIn = function() {



			$ionicLoading.show({
				template: 'Logging in...'
			});

			window.plugins.googleplus.login({
					webClientId: '792068565007-rdm7nrlfmc29jvlqo5l0tkgu6ci0vboa.apps.googleusercontent.com'

				},
				function(user_data) {
					var profile = {};
					profile.id = user_data.userId;
					profile.displayName = user_data.displayName;
					profile.imageUrl = user_data.imageUrl;
					RequestsService.googleSignIn(profile)
						.then(function(response) {
							$auth.setToken(response.data.token);
							successfulAuthentication(response.data.user);
						}).catch(function(err) {
							console.log("error");
							console.log(err);
							$ionicLoading.hide();
						});

				},
				function(msg) {
					alert("missed");
					console.log(msg);
					$ionicLoading.hide();
				}
			);
		};
		function successfulAuthentication(user) {
			userData.setUser(user);
			userLocationService.setUserLocation();
			RequestsService.register();

			if (user.device_token) {
				$state.go('home.post.popular');
			} else {
				$state.go('home.userEditPage');
			}
		}

		function socialAuthenticate(provider) {
			$ionicLoading.show();
			$auth.authenticate(provider).then(function(response) {
				successfulAuthentication(response.data.user);
			}).catch(function(err) {
				$ionicLoading.hide();

			}).finally(function() {
				//$ionicLoading.hide();
			});
		}


		function loadPostModal() {
			$ionicModal.fromTemplateUrl('app/home/views/policy.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}


		function authLogout() {
			$auth.logout();
			userData.removeUser();
			$state.go('authenticate');
		}
	}


})(window.angular);
