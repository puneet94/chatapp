(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserPageController', ['$state', '$auth', 'userService', 'revealService','$stateParams', 'friends','postService','$window','$ionicLoading',UserPageController]);

	function UserPageController($state, $auth, userService, revealService,$stateParams,friends,postService,$window,$ionicLoading) {

		var upc = this;
		upc.checkReveal = checkReveal;
		upc.goBack = goBack;
		upc.activateTab = activateTab;
		upc.isTabActive = isTabActive;
		upc.openFacebook = openFacebook;
		activate();
		function openFacebook(id){
			$window.open('https://www.facebook.com/'+id, '_system');
		}
		function activate() {
			getUser();
			upc.revealChoice = friends;
			upc.activeTab = 1;
			getUserPosts();
		}
		function getUserPosts(){
			upc.params = {
				page: 1,
				limit: 100,
				user: $stateParams.user
			};
			postService.getLatestPosts(upc.params).then(function(res){
				upc.postsList = res.data.docs;
			});
		}
		function activateTab(tabIndex){
			upc.activeTab = tabIndex;
		}
		function isTabActive(tabIndex){
			return tabIndex === upc.activeTab;
		}
		
		function checkReveal(){
			
			revealService.check($stateParams.user).then(function(res){
				upc.revealChoice = res.data;
			});
		}
		function goBack(){
			window.history.back();
		}
		function getUser() {
			userService.getUser($stateParams.user).then(function(response) {
				upc.user = response.data;
				
			}).finally(function(){
				$ionicLoading.hide();
			});
		}
	}
})(window.angular);
