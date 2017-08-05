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
			state('home.user.userMePage', {
				url: '/userMePage',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userMePage.html',
						controller: 'UserMePageController',
						controllerAs: 'umpc',
						
					}
				}

			}).
			state('home.userPage', {
				url: '/userPage/:user',
				resolve: {
					currentUser: [ '$stateParams','$state', '$auth','$q', '$timeout',currentUser],
					blocked: [ '$stateParams', 'blockService','$q', blocked],
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
	function blocked($stateParams,blockService,$q){
		var defer = $q.defer();
		blockService.check($stateParams.user).then(function(response){
			
			if(response.data.blocked===true){
				window.alert("Blocked profile");
				window.history.back();
			}
			else{
				defer.resolve();	
			}
			
			
		}).catch(function(){
			defer.resolve();	
		});
		return defer.promise;
	}
	function currentUser($stateParams,$state,$auth,$q,$timeout){
		var defer = $q.defer();
		if($stateParams.user!=$auth.getPayload().sub){
			
			defer.resolve();	
		}else{
			$timeout(function() {
				$state.go('home.user.userMePage');
				defer.reject();
			});
			
			
		}
		return defer.promise;
	}
	function friends($stateParams,revealService,$q){
		var defer = $q.defer();


		revealService.check($stateParams.user).then(function(response){
			
			defer.resolve(response.data.status);
			//return ;
		}).catch(function(){
			
		});
		return defer.promise;
	}

	
})(window.angular);
