(function(angular) {
	'use strict';
	angular.module('petal.home')
		.controller('HomeController', ['$scope', '$state', HomeController]);

	function HomeController($scope, $state) {
		var hc = this;
		hc.badgeValue= '';
		hc.chatClicked=chatClicked;

		

		function chatClicked(){
			$state.go('home.chat.all');
		}
	}
})(window.angular);
