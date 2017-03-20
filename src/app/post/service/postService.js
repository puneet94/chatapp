(function(angular) {
	'use strict';
	angular.module('petal.post').
	service('postService', ['$http', 'homeService', 'userLocationService', '$q',PostService]);


	function PostService($http, homeService, userLocationService,$q) {
		this.getAllPosts = getAllPosts;
		this.getNearbyPosts = getNearbyPosts;
		this.getLatestPosts = getLatestPosts;
		this.getPopularPosts = getPopularPosts;
		this.submitPost = submitPost;
		this.deletePost = deletePost;
		this.getPost = getPost;


		function getAllPosts(params) {

			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}

		function getNearbyPosts(params) {
			params.nearby = true;
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}

		function getLatestPosts(params) {
			params.sort = 'time';
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}

		function getPopularPosts(params) {
			params.sort = 'upvotesLength';
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}

		function submitPost(post) {
			var defer = $q.defer();
			userLocationService.getUserLocation().then(function(position) {
				post.latitude = position.latitude;
				post.longitude = position.longitude;
				$http.post(homeService.baseURL + 'post/create', { post: post }).then(function(response) {
					defer.resolve(response);
				}).catch(function(err) {
					defer.reject(err);
				});
			}).catch(function(err) {
				defer.reject(err);
			});
			return  defer.promise;
		}

		function deletePost(postId) {
			return $http.delete(homeService.baseURL + 'post/delete/' + postId);
		}

		function getPost(postId) {
			return $http.get(homeService.baseURL + 'post/get/' + postId);
		}

	}
})(window.angular);
