(function(angular){
	'use strict';
	angular.module('petal.user').
		controller('UserPageController',['$state','$auth','userService','$stateParams',UserPageController]);

		function UserPageController($state,$auth,userService,$stateParams){
			
			var umpc = this;
			umpc.logout = logout;
			activate();
			function logout(){
				$auth.logout();
				$state.go('authenticate');
			}

			function activate(){
				getUser();
			}

			function getUser(){
				userService.getUser($stateParams.user).then(function(response){
					console.log(":page user");
					console.log(response);
					umpc.user = response.data;
				});
			}
		}
})(window.angular);