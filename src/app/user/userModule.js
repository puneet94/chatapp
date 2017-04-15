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
			state('home.userPage', {
				url: '/userPage/:user',
				resolve: {
					friends: [ '$stateParams', 'revealService','$q', friends]
				},
				views: {
					'extra-tab': {
						templateUrl: 'app/user/views/userProfilePage.html',
						controller: 'UserPageController',
						controllerAs: 'upc'
					}
				},
				

			})
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
			.state('home.user.userMePage', {
				url: '/userMePage',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userMePage.html',
						controller: 'UserMePageController',
						controllerAs: 'umpc',
						
					}
				}

			})
			.state('home.userEditPage', {
				url: '/userEditPage',
				views: {
					'extra-tab': {
						templateUrl: 'app/user/views/userEditPage.html',
						controller: 'UserEditPageController',
						controllerAs: 'uepc',
						
					}
				}

			});
		}
	]);

	function friends($stateParams,revealService,$q){
		var defer = $q.defer();


		revealService.check($stateParams.user).then(function(response){
			
			defer.resolve(response.data.status);
			//return ;
		}).catch(function(err){
			alert(err);
		});
		return defer.promise;
	}

	
})(window.angular);
