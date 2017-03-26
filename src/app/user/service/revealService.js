(function(angular) {
	'use strict';
	angular.module('petal.user').
	service('revealService', ['$http', 'homeService',RevealService]);


	function RevealService($http, homeService) {
		this.initiate = initiate;
		this.accept = accept;
		this.ignore = ignore;
		this.cancel = cancel;
		this.received = received;
		this.requested = requested;
		this.revealed = revealed;
		this.finish = finish;
		this.check = check;

		function getParams(id){
			return {
				'secondUser': id
			};
		}
		function initiate(id) {
			return $http.post(homeService.baseURL + 'reveal/initiate', { secondUser: id });
		}

		function accept(id) {
			
			return $http.post(homeService.baseURL + 'reveal/accept', { secondUser: id });
		}

		function ignore(id) {
			
			return $http.post(homeService.baseURL + 'reveal/ignore', { secondUser: id });
		}

		function cancel(id) {
			
			return $http.post(homeService.baseURL + 'reveal/cancel', { secondUser: id });
		}

		function received(id) {
			var params = getParams(id);
			return $http.get(homeService.baseURL + 'reveal/received', {params:params});
				
		}

		function requested(id) {
			var params = getParams(id);
			return $http.get(homeService.baseURL + 'reveal/requested', {params:params});
		}

		function revealed(id) {
			var params = getParams(id);
			return $http.get(homeService.baseURL + 'reveal/revealed', {params:params});
		}
		function finish(id) {
			return $http.post(homeService.baseURL + 'reveal/finish', {secondUser: id});
		}
		function check(id){
			var params = getParams(id);
			return $http.get(homeService.baseURL + 'reveal/check', {params:params});	
		}

	}
})(window.angular);