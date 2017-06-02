(function(angular) {
	'use strict';
	angular.module('petal.user').
	service('blockService', ['$http', 'homeService',BlockService]);


	function BlockService($http, homeService) {
		this.create = create;
		this.remove = remove;
		this.getBlocks = getBlocks;
		this.check = check;
		
		function create(id) {
			return $http.post(homeService.baseURL + 'block/create', { secondUser: id });
		}
		function remove(id) {	
			return $http.post(homeService.baseURL + 'block/delete', { secondUser: id });
		}
		function check(id) {
			return $http.get(homeService.baseURL + 'block/get/'+id);
		}
		function getBlocks() {
			return $http.get(homeService.baseURL + 'block/getBlocks/');
		}
	}
})(window.angular);