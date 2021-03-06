(function(angular) {
'use strict';
angular.module('petal.post').
service('postService', ['$http', 'homeService', 'userLocationService' ,'$q', '$auth',PostService]);


function PostService($http, homeService, userLocationService, $q,$auth) {
	this.getAllPosts = getAllPosts;
	this.getNearbyPosts = getNearbyPosts;
	this.getLatestPosts = getLatestPosts;
	this.getPopularPosts = getPopularPosts;
	this.submitPost = submitPost;
	this.deletePost = deletePost;
	this.getPost = getPost;
	this.getDistance = getDistance;

	
	function getAllPosts(params) {
		
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		
		
	}
	function getFilteredPosts(defer,params){
		$http.get(homeService.baseURL + "post/getPosts", { params: params }).then(function(posts) {
				console.log("without position");
				defer.resolve(posts);
			}).catch(function(err2) {
				defer.reject(err2);
			});
	}
	function getNearbyPosts(params) {
		params.nearby = true;
		var defer = $q.defer();
		
		if(params.page==1){
			userLocationService.setUserLocation();
			}
			
		userLocationService.getUserLocation().then(function(position) {
			params.latitude = position.latitude;
			params.longitude = position.longitude;
			$http.get(homeService.baseURL + "post/getPosts", { params: params }).then(function(posts) {
				defer.resolve(posts);
			}).catch(function(err) {
				defer.reject(err);
			});
		}).catch(function(err) {
			window.console.log(err);
			getFilteredPosts(defer,params);
		});

		return defer.promise;

	}
	function getPostsFunction(url,params){
		var defer = $q.defer();
		
		if (typeof(window.Worker) !== "undefined") {
			 var worker = new window.Worker('./js/postList.js');
			 var workerData = {
			 	"params": params,
			 	"url": url,
			 	"token": $auth.getToken()
			 };
			 worker.postMessage(JSON.stringify(workerData));
  			worker.onmessage = function (event) {
    				
			defer.resolve({data:JSON.parse(event.data)});
    				
  			};
		} else {
		    alert("inisde else");
			return $http.get(url, { params: params });    
		}
		return defer.promise;
	}
	function getLatestPosts(params) {
		params.sort = '-time';
		var url  = homeService.baseURL + 'post/getPosts';
		return getPostsFunction(url,params);
		
	}

	function getPopularPosts(params) {
		params.sort = '-upvotesLength';
		var url = homeService.baseURL + 'post/getPosts';
		return getPostsFunction(url,params);
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
			$http.post(homeService.baseURL + 'post/create', { post: post }).then(function(response) {
			
				defer.resolve(response);
			}).catch(function(err2) {
				defer.reject(err2);
			});
		});
		return defer.promise;
	}

	function deletePost(postId) {
		return $http.delete(homeService.baseURL + 'post/delete/' + postId);
	}

	function getPost(postId) {
		return $http.get(homeService.baseURL + 'post/get/' + postId);
	}

	function getDistance(posObj) {
		var defer = $q.defer();
		var lat1 = posObj.latitude;
		var lon1 = posObj.longitude;
		userLocationService.getUserLocation().then(function(position) {
			var lat2 = position.latitude;
			var lon2 = position.longitude;
			var R = 6371; // Radius of the earth in km
			var dLat = deg2rad(lat2 - lat1); // deg2rad below
			var dLon = deg2rad(lon2 - lon1);
			var a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) * Math.sin(dLon / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c; // Distance in km
		
			defer.resolve(Math.ceil(d));
		}).catch(function(err) {
			console.log(err);
		});
		return defer.promise;

	}

	function deg2rad(deg) {
		return deg * (Math.PI / 180);
	}

}
})(window.angular);
