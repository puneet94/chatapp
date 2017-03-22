(function(angular){
	'use strict';
	angular.module('petal.user').
		controller('UserMePageController',['$state','$auth','userData',UserMePageController]);

		function UserMePageController($state,$auth,userData){
			
			var umpc = this;
			umpc.logout = logout;

			function logout(){
				$auth.logout();
				$state.go('authenticate');
			}
		}
})(window.angular);