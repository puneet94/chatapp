(function(angular) {
	'use strict';
	
		angular.module('petal.home')
			.service('RequestsService', ['homeService', '$http', '$q', '$ionicLoading', '$cordovaPushV5', '$auth', RequestsService]);
	

	function RequestsService(homeService, $http, $q, $ionicLoading, $cordovaPushV5, $auth) {

		var base_url = homeService.baseURL;

		function register() {

			var deferred = $q.defer();
			
			var options = {
				android: {
					senderID: "679461840115",
					vibrate: "true"
				},
				browser:{

				},
				ios: {
					alert: "true",
					badge: "true",
					sound: "true"
				},
				windows: {}
			};
			/*if(vibrate){
				//options.android.vibrate = true;
				//options.android.forceShow =true;
			}*/
			
			$cordovaPushV5.initialize(options).then(function() {
				// start listening for new notifications
				$cordovaPushV5.onNotification(function(){
					console.log("insideeee notification");
					console.log(arguments);
				});
				// start listening for errors
				$cordovaPushV5.onError();

				// register to get registrationId
				if ($auth.isAuthenticated()) {
					$cordovaPushV5.register().then(function(registrationId) {
						$http.post(base_url + 'notification/register', { 'device_token': registrationId })
							.then(function(response) {
								deferred.resolve(response);
							})
							.catch(function(data) {
								deferred.reject(data);
							}).finally(function() {
								$ionicLoading.hide();
							});
					});
				}

			});


			return deferred.promise;

		}
		return {
			register: register
		};
	}

})(window.angular);
