(function(angular){
	'use strict';
	angular.module('petal.home')
		.service('homeService',['$http',HomeService]);

		function HomeService($http){
			this.baseURL = 'https://petalchat-imanjithreddy.c9users.io/';
		}
})(window.angular);