(function(angular){
	'use strict';
	angular.module('petal.user').
		controller('UserMePageController',['$scope','$state','$auth','userData','$ionicModal','userService',UserMePageController]);

		function UserMePageController($scope,$state,$auth,userData,$ionicModal,userService){
			
			var umpc = this;
			umpc.logout = logout;
			activate();
			function getUser(){
				userData.setUser().then(function(){
					umpc.user = userData.getUser();
					$scope.editForm.user = umpc.user;
				});
				
			}
			function loadPostModal() {
					$ionicModal.fromTemplateUrl('app/user/views/userEditForm.html', {
						scope: $scope
					}).then(function(modal) {
						$scope.editForm.modal = modal;
					});
				}
			function logout(){
				$auth.logout();
				$state.go('authenticate');
			}
			function activate(){
				getUser();
				$scope.editForm = {};
				loadPostModal();
			}
			$scope.editForm.submitUser = function(){
				userService.updateUser($scope.editForm.user ).then(function(){
					window.alert("updated user");
					$scope.editForm.modal.hide();
				})
			}
		}
})(window.angular);