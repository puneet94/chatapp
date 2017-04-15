(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserEditPageController', ['$scope', '$state', 'homeService', 'userData', 'userService', 'Upload', '$ionicLoading', UserEditPageController]);

	function UserEditPageController($scope, $state, homeService, userData, userService, Upload, $ionicLoading) {

		var umpc = this;

		umpc.activate = activate;

		activate();

		function getUser() {
			umpc.user = userData.getUser();
			$scope.editForm.user = umpc.user;
			if (umpc.user.interests.length) {
				$scope.editForm.user.interests = '!' + umpc.user.interests.join('!');
			}
		}

		function activate() {
			$ionicLoading.hide();
			$scope.editForm = {};
			getUser();
			
		}

		$scope.editForm.submitUser = function() {
			$ionicLoading.show();
			
			userService.updateUser($scope.editForm.user).then(function(res) {
				window.alert("updated user");
				$state.go('home.user.userMePage');
			}).catch(function(err){
				window.alert(err);
			}).finally(function(){
				userData.setUser();
				$ionicLoading.hide();
			});
		};
		$scope.editForm.uploadUserPicture = function(file, errFiles) {
			$scope.loadingImage = true;
			umpc.file = file;
			umpc.errFile = errFiles && errFiles[0];
			if (file) {
				umpc.file.upload = Upload.upload({
					url: homeService.baseURL + 'upload/singleUpload',
					data: { file: umpc.file }
				});

				umpc.file.upload.then(function(response) {
					umpc.file.result = response.data;
					$scope.editForm.user.picture = response.data;
					$scope.loadingImage = false;



				});
			}

		};
	}
})(window.angular);
