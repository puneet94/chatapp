(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserMePageController', ['$scope', '$state', '$auth', 'homeService','userData', '$ionicModal', 'userService', 'peopleService', 'Upload','postService','$window', '$ionicLoading',UserMePageController]);

	function UserMePageController($scope, $state, $auth, homeService,userData, $ionicModal, userService, peopleService, Upload,postService,$window,$ionicLoading) {

		var umpc = this;
		umpc.logout = logout;
		umpc.activate = activate;
		umpc.activeTab = 1;
		umpc.activateTab = activateTab;
		umpc.isTabActive = isTabActive;
		umpc.openFacebook = openFacebook;
		activate();
		function openFacebook(id){
			$window.open('https://www.facebook.com/'+id, '_system');
		}
		function getUser() {
			userData.setUser().then(function() {
				umpc.user = userData.getUser();
				$scope.editForm.user = umpc.user;
				if (umpc.user.interests.length) {
					$scope.editForm.user.interests = '!' + umpc.user.interests.join('!');
				}

			}).finally(function(){
				$ionicLoading.hide();
			});

		}
		function getUserPosts(){
			umpc.params = {
				page: 1,
				limit: 100,
				user: userData.getUser()._id
			};
			postService.getAllPosts(umpc.params).then(function(res){
				umpc.postsList = res.data.docs;
			});
		}
		function activateTab(tabIndex){
			umpc.activeTab = tabIndex;
		}
		function isTabActive(tabIndex){
			return tabIndex === umpc.activeTab;
		}
		function loadPostModal() {
			$ionicModal.fromTemplateUrl('app/user/views/userEditForm.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.editForm.modal = modal;
			});
		}

		function logout() {
			$auth.logout();
			$state.go('authenticate');
		}

		function activate() {
			getUser();
			$scope.editForm = {};
			loadPostModal();
			getRequestedList();
			$scope.$broadcast('scroll.refreshComplete');
			getUserPosts();
		}

		function getRequestedList() {
			peopleService.getRequestedUsers({ page: 1, limit: 25 }).then(function(response) {
				umpc.peopleList = response.data.docs;
				umpc.total = response.data.total;
			});
		}
		$scope.editForm.submitUser = function() {
			userService.updateUser($scope.editForm.user).then(function() {
				window.alert("updated user");
				$scope.editForm.modal.hide();
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
