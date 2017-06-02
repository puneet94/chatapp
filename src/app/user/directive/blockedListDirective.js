(function(angular){
	'use strict';
	angular.module('petal.user')
		.directive('blockedList',['blockService',blockedList]);

	function blockedList(blockService){
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/user/views/blockedList.html',
			link: function(scope){
				scope.afterCallback = function(index){
					scope.peopleList.splice(index,1);
				};
				blockService.getBlocks().then(function(response){
					window.console.log(response);
					scope.peopleList = response.data;
				});
			}
		};
	}
})(window.angular);