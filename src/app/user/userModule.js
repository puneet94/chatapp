(function(angular) {
	'use strict';
	angular.module('petal.user', []).config(['$stateProvider',
		function($stateProvider) {
			$stateProvider.
			state('home.user', {
				url: '/user',
				'abstract': true,
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userParentPage.html',
						controller: 'UserParentController',
						controllerAs: 'upc'
					}
				}

			}).
			state('home.user.userPage', {
				url: '/userPage/:user',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userProfilePage.html',
						controller: 'UserPageController',
						controllerAs: 'upc'
					}
				}

			}).
			/*state('tabs.userProfileSettings', {
				url: '/userProfileSettings',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userProfileSettingsPage.html',
					}
				}

			}).
			state('tabs.userAccountSettings', {
				url: '/userAccountSettings',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userAccountSettingsPage.html',
					}
				}

			}).*/
			state('home.user.userMePage', {
				url: '/userMePage',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userMePage.html',
						controller: 'UserMePageController',
						controllerAs: 'umpc',
						
					}
				}

			});
		}
	]);



	function redirectIfNotUserAuthenticated($q, $auth, changeBrowserURL) {
		var defer = $q.defer();

		if ($auth.isAuthenticated()) {
			defer.resolve();

		} else {
			defer.reject();
			changeBrowserURL.changeBrowserURLMethod('/home');
		}
		return defer.promise;
	}

})(window.angular);
