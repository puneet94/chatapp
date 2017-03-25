(function(angular) {
	'use strict';
	angular.module('petal.home', [])
		.config(['$stateProvider', '$authProvider', config]);

	function config($stateProvider, $authProvider) {
		var fbClientId = '1134208830041632';
		var redirectUrl = "http://localhost:8100";
		var redirectUrl2 = "https://petalchat-imanjithreddy.c9users.io";
		var authenticateUrl = redirectUrl2 + '/authenticate';
		$authProvider.facebook({
			clientId: fbClientId,
			url: authenticateUrl + '/auth/facebook',
			redirectUri: "https://petalchat-imanjithreddy.c9users.io/"
		});
		$authProvider.google({
			clientId: '742676837265-33jntkd60p87gkrh48nqe6cdd8ntsfl5.apps.googleusercontent.com',
			url: authenticateUrl + '/auth/google',
			redirectUri: redirectUrl
		});
		$stateProvider.state('authenticate', {
			url: '/authenticate',
			controller: 'AuthenticationController',
			controllerAs: 'ac',
			templateUrl: 'app/home/views/authenticationPage.html',
			

		}).state('home', {
			url: "/home",
			abstract: true,
			templateUrl: "app/home/views/tabs.html",
			controller: 'HomeController',
			controllerAs: 'hc',
			resolve: {
				redirectIfUserNotAuthenticated: ['$q', '$auth', '$state', '$timeout', redirectIfUserNotAuthenticated]
			}
		});
	}



	function redirectIfUserNotAuthenticated($q, $auth, $state, $timeout) {
		var defer = $q.defer();

		if ($auth.isAuthenticated()) {

			defer.resolve();

		} else {
			console.log("not audsnf");
			$timeout(function() {
				$state.go('authenticate');
			});
			//defer.reject();
		}
		return defer.promise;
	}
	function redirectIfUserAuthenticated($q, $auth) {
		var defer = $q.defer();

		if ($auth.isAuthenticated()) {
			defer.reject();
			/*$timeout(function() {
				$state.go('authenticate');
			});*/
			

		} else {
			console.log("not audsnf");
			defer.resolve();
			//defer.reject();
		}
		return defer.promise;
	}

})(window.angular);
