(function(angular){
	'use strict';
	angular.module('petal.home')
	.service('RequestsService', ['homeService','$http', '$q', '$ionicLoading',  RequestsService]);

	function RequestsService(homeService,$http, $q, $ionicLoading){

		var base_url = homeService.baseURL;

		function register(device_token){

			var deferred = $q.defer();
			$ionicLoading.show();

			$http.post(base_url + 'notification/register', {'device_token': device_token})
				.then(function(response){
					
					
					deferred.resolve(response);
					
				})
				.catch(function(data){
					deferred.reject(data);	
				}).finally(function(){
					$ionicLoading.hide();
				});
			

			return deferred.promise;			

		}
		return {
			register: register
		};
	}
})(window.angular);