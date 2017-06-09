(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserMePageController', ['$scope', '$state', '$auth','userData', 'peopleService','postService','$window', '$ionicLoading',UserMePageController]);

	function UserMePageController($scope, $state, $auth,userData, peopleService,postService,$window,$ionicLoading) {

		var umpc = this;
		umpc.logout = logout;
		umpc.activate = activate;
		
		umpc.activeTab = 1;
		umpc.activateTab = activateTab;
		umpc.isTabActive = isTabActive;

		umpc.subActiveTab = 1;
		umpc.subActivateTab = subActivateTab;
		umpc.isSubTabActive = isSubTabActive;



		umpc.openFacebook = openFacebook;
		activate();
		function openFacebook(id){
			$window.open('https://www.facebook.com/'+id, '_system');
		}
		function getUser() {
			userData.setUser().then(function() {
				umpc.user = userData.getUser();

			}).catch(function(err){
				window.console.log(err);
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
			postService.getLatestPosts(umpc.params).then(function(res){
				umpc.postsList = res.data.docs;
			});
		}
		function activateTab(tabIndex){
			umpc.activeTab = tabIndex;
		}
		function isTabActive(tabIndex){
			return tabIndex === umpc.activeTab;
		}
		function subActivateTab(subTabIndex){
			umpc.subActiveTab = subTabIndex;
		}
		function isSubTabActive(subTabIndex){
			return subTabIndex === umpc.subActiveTab;
		}

		function logout() {
			$auth.logout();
			$state.go('authenticate');
		}

		function activate() {
			getUser();
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
		function getReceivedList() {
			peopleService.getReceivedUsers({ page: 1, limit: 25 }).then(function(response) {
				umpc.peopleList = response.data.docs;
				umpc.total = response.data.total;
			});
		}
		function getRevealedList() {
			peopleService.getRevealedUsers({ page: 1, limit: 25 }).then(function(response) {
				umpc.peopleList = response.data.docs;
				umpc.total = response.data.total;
			});
		}
		
	}
})(window.angular);
