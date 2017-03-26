(function(angular) {

	'use strict';

	var app = angular.module('petal', ['ui.router', 'ionic', 'satellizer', 'ngFileUpload', 'btford.socket-io',
		'ngCordova','toastr', 'petal.home', 'petal.post', 'petal.chat', 'petal.user', 'petal.people',
	]);
	app.config(['$urlRouterProvider', '$stateProvider', '$ionicConfigProvider',
		function($urlRouterProvider, $stateProvider, $ionicConfigProvider) {
			$ionicConfigProvider.tabs.position("bottom");
			$urlRouterProvider.otherwise('/home/post/all');
		}
	]);
	app.run(['$rootScope', '$state', '$ionicPlatform', function($rootScope, $state, $ionicPlatform) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});

		/*$rootScope.$on('$stateChangeError', function() {

			//hide loading gif

			console.log('you are not authorized to view this page');
			
			$state.go('authenticate');


		});*/
	}]);
})(window.angular);
// red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green,,
//light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });//"angular-material": "master","ng-directive-lazy-image": "afkl-lazy-image#^0.3.1"
