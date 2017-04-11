(function(angular) {

	'use strict';

	var app = angular.module('petal', ['ionic', 'satellizer', 'ngFileUpload', 'btford.socket-io',
		'ngCordova', 'toastr', 'petal.home', 'petal.post', 'petal.chat', 'petal.user', 'petal.people',
	]);
	app.config(['$urlRouterProvider', '$stateProvider', '$ionicConfigProvider',
		function($urlRouterProvider, $stateProvider, $ionicConfigProvider) {
			$ionicConfigProvider.tabs.position("bottom");
			$urlRouterProvider.otherwise('/home/post/nearby');
		}
	]);
	app.run(['$rootScope', '$state', '$ionicPlatform', '$ionicLoading', 'RequestsService', '$cordovaPushV5', '$ionicHistory',function($rootScope, $state, $ionicPlatform, $ionicLoading, RequestsService, $cordovaPushV5,$ionicHistory) {

		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
				//window.pushNotification = window.plugins.pushNotification;
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}

			notificationFunction();
			backButtonExit();
			$rootScope.$on('$stateChangeStart', function() {
				$ionicLoading.show();
			});
		});

		function backButtonExit() {
			$ionicPlatform.registerBackButtonAction(function(e) {
				if ($rootScope.backButtonPressedOnceToExit) {
					ionic.Platform.exitApp();
				} else if ($ionicHistory.backView()) {
					$ionicHistory.goBack();
				} else {
					$rootScope.backButtonPressedOnceToExit = true;
					window.plugins.toast.showShortCenter(
						"Press back button again to exit",
						function(a) {},
						function(b) {}
					);
					window.setTimeout(function() {
						$rootScope.backButtonPressedOnceToExit = false;
					}, 2000);
				}
				e.preventDefault();
				return false;
			}, 101);
		}

		function notificationFunction() {
			var options = {
				android: {
					senderID: "679461840115"
				},
				ios: {
					alert: "true",
					badge: "true",
					sound: "true"
				},
				windows: {}
			};

			$cordovaPushV5.initialize(options).then(function() {
				// start listening for new notifications
				$cordovaPushV5.onNotification();
				// start listening for errors
				$cordovaPushV5.onError();

				// register to get registrationId
				$cordovaPushV5.register().then(function(registrationId) {
					RequestsService.register(registrationId).then(function(response) {

					});
				});
			});


			$rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {

				// data.message,
				// data.title,
				// data.count,
				// data.sound,
				// data.image,
				// data.additionalData
			});

			// triggered every time error occurs
			$rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e) {
				console.log(event);
				console.log(e);
			});
		}
		/*(function() {
			window.onNotification = function(e) {

				console.log('notification received');

				switch (e.event) {
					case 'registered':
						if (e.regid.length > 0) {

							var device_token = e.regid;
							RequestsService.register(device_token).then(function(response) {
								window.alert(response);
								window.alert('registered!');
							});
						}
						break;

					case 'message':
						window.alert('msg received');
						window.alert(JSON.stringify(e));
						break;

					case 'error':
						window.alert('error occured');
						break;

				}
			};


			window.errorHandler = function(error) {
				window.alert('an error occured');
				window.alert(error);
			};

			if (window.pushNotification) {
				window.pushNotification.register(
					window.onNotification,
					window.errorHandler, {
						'badge': 'true',
						'sound': 'true',
						'alert': 'true',
						'senderID': '679461840115',
						'ecb': 'onNotification'
					}
				);
			}

		})();*/
	}]);
})(window.angular);
// red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green,,
//light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });//"angular-material": "master","ng-directive-lazy-image": "afkl-lazy-image#^0.3.1"
