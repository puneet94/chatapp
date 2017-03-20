(function(angular) {
	'use strict';
	angular.module('petal.post', [])
		.config(['$stateProvider', config]);


	function config($stateProvider) {
		
		$stateProvider
			.state('home.post',{
				url: '/post',
				abstract: true,
				views: {
					'post-tab': {
						templateUrl: 'app/post/views/postParent.html',
						controller: 'PostParentController',
						controllerAs: 'ppc'
					}
				}
				
			}).state('home.post.all',{
				url: '/all',
				
				views: {
					'post-tab': {
						templateUrl: 'app/post/views/allPost.html',
						controller: 'AllPostController',
						controllerAs: 'apc'
					}
				}			
			}).state('home.post.latest',{
				url: '/latest',
				
				views: {
					'post-tab': {
						templateUrl: 'app/post/views/latestPost.html',
						controller: 'LatestPostController',
						controllerAs: 'lpc'
					}
				}				
			}).state('home.post.popular',{
				url: '/popular',
				
				views: {
					'post-tab': {
						templateUrl: 'app/post/views/popularPost.html',
						controller: 'PopularPostController',
						controllerAs: 'ppc'
					}
				}				
			}).state('home.post.nearby',{
				url: '/nearby',
				
				views: {
					'post-tab': {
						templateUrl: 'app/post/views/nearbyPost.html',
						controller: 'NearbyPostController',
						controllerAs: 'npc'
					}
				}				
			}).state('home.postSubmit',{
				url: '/submit',
				
				views: {
					'postSubmit-tab': {
						templateUrl: 'app/post/views/createPost.html',
						controller: 'CreatePostController',
						controllerAs: 'cpc'
					}
				}				
			});
	}


})(window.angular);
