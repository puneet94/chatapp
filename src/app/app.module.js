(function(angular) {

	'use strict';
		

		var app = angular.module('petal', ['ionic', 'satellizer', 'ngFileUpload', 'btford.socket-io',
			'ngCordova', 'toastr', 'petal.home', 'petal.post', 'petal.chat', 'petal.user', 'petal.people',
		]);
		app.config(['$urlRouterProvider', '$stateProvider', '$ionicConfigProvider',
			function($urlRouterProvider, $stateProvider, $ionicConfigProvider) {
				$ionicConfigProvider.tabs.position("bottom");
				$urlRouterProvider.otherwise('/home/post/all');
			}
		]);
		app.run(['$rootScope', '$state', '$ionicPlatform', '$ionicLoading', 'RequestsService', '$cordovaPushV5', '$ionicHistory', function($rootScope, $state, $ionicPlatform, $ionicLoading, RequestsService, $cordovaPushV5, $ionicHistory) {

			$ionicPlatform.ready(function() {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
					cordova.plugins.Keyboard.disableScroll(true);
					//window.pushNotification = window.plugins.pushNotification;
					notificationFunction();
					backButtonExit();
				}
				if (window.StatusBar) {
					// org.apache.cordova.statusbar required
					StatusBar.styleDefault();
				}

				window.onerror = function(errorMsg, url, lineNumber) {
					return false;
				};
				$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
					if (fromState.name != 'chatBox') {
						//$ionicLoading.show();

					}
				});

				$rootScope.$on("$stateChangeError", function() {
					$state.go('home.post.all');
					$ionicLoading.hide();
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
				RequestsService.register();

				$rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {
				});

				// triggered every time error occurs
				$rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e) {

				});
			}
		}]);
	
})(window.angular);
// red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green,,
//light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });//"angular-material": "master","ng-directive-lazy-image": "afkl-lazy-image#^0.3.1"
