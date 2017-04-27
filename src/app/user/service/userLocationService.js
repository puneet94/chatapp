(function(angular) {
	'use strict';

	angular.module('petal.user')
		.service('userLocationService', ['$cordovaGeolocation', 'userService', '$q', '$http', 'toastr', UserLocationService]);


	function UserLocationService($cordovaGeolocation, userService, $q, $http, toastr) {
		this.getUserLocation = getUserLocation;
		this.setUserLocation = setUserLocation;

		function getUserLocation() {
			
			var deferred = $q.defer();
			var options = { timeout: 3000, enableHighAccuracy: false };

			$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
				var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
				deferred.resolve(positions);
			}).catch(function() {
				$http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA5bqvCp1wYX7FGKiDyd3w0DzvJZoPwQrQ').then(function(response) {
					var coords = {
						latitude: response.data.location.lat,
						longitude: response.data.location.lng
					};
					deferred.resolve(coords);
				}).catch(function(err) {
					window.console.log("error from google");
					window.console.log(err);
					deferred.reject('Not able to acces your location.Make sure location is enabled.');
				});

			});
			return deferred.promise;
		}

		function setUserLocation() {
			var options = { timeout: 3000, enableHighAccuracy: false };
			$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
				var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
				userService.updateUser(positions);
			}).catch(function(err) {
				$http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA5bqvCp1wYX7FGKiDyd3w0DzvJZoPwQrQ').then(function(response) {
					var coords = {
						latitude: response.data.location.lat,
						longitude: response.data.location.lng
					};
					userService.updateUser(coords);
					
				}).catch(function() {
					if (err.code == 3) {
							toastr.warning('Not able to acces your location.Make sure location is enabled.', 'Warning', {

								maxOpened: 1,
							});

						} else if (err.code == 2 || err.code == 1) {
							toastr.warning('Not able to acces your location.Make sure location is enabled.', 'Warning', {

								maxOpened: 1,
							});
						}
				});
				
			});
		}




	}
})(window.angular);
