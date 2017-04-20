(function(angular) {
	'use strict';
	/*
	 *Service for getting a single store with its id
	 */
	angular.module('petal.user')
		.service('userLocationService', ['$cordovaGeolocation', 'userService', '$q', '$http', UserLocationService]);

	/*
	 * This servic has a function names getStore which takes id as parameter and returns a promise
	 */
	function UserLocationService($cordovaGeolocation, userService, $q, $http) {
		this.getUserLocation = getUserLocation;
		this.setUserLocation = setUserLocation;

		function getUserLocation() {
			var deferred = $q.defer();
			var options = { timeout: 10000, enableHighAccuracy: false };

			$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
				var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
				deferred.resolve(positions);
			}).catch(function(err) {
				window.console.log("first catch");
				window.console.log(err);
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						window.console.log("seconddddd one");
						var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
						deferred.resolve(positions);
					}, function() {
						$http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDCa1LUe1vOczX1hO_iGYgyo8p_jYuGOPU').then(function(data) {
							window.console.log("from the maps");
							window.console.log(data);
						}).catch(function(err3) {
							window.console.log("third err");
							window.console.log(err3);
						});
					});
				} else {
					/*if (err.code == 3) {
						window.alert("Unable to access your location.Make sure location is turned on.");
					} else if (err.code == 2 || err.code == 1) {
						window.alert("Please enable location or gps");
					}*/
					deferred.reject('Not able to acces your location.Make sure location is enabled');
				}

			});


			return deferred.promise;
		}

		function setUserLocation() {
			var options = { timeout: 10000, enableHighAccuracy: false };
			$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
				var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
				userService.updateUser(positions);
			}).catch(function() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
						userService.updateUser(positions);
					});
				}
			});
		}




	}
})(window.angular);
