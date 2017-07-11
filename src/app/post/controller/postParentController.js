(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('PostParentController',[PostParentController]);

	function PostParentController(){
		var ppc = this;
		//$rootScope.slideHeader = true;
		ppc.fabContainerShown = false;
		ppc.showFabContainer = function(){
			ppc.fabContainerShown = !ppc.fabContainerShown ;
		};
	}
})(window.angular);