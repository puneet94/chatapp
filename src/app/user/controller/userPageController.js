(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserPageController', ['$state', '$auth', 'userService', 'revealService','$stateParams', '$ionicActionSheet','friends','postService',UserPageController]);

	function UserPageController($state, $auth, userService, revealService,$stateParams,$ionicActionSheet,friends,postService) {

		var upc = this;
		upc.sendReveal = sendReveal;
		upc.cancelReveal = cancelReveal;
		upc.decideReveal = decideReveal;
		upc.deleteReveal = deleteReveal;
		upc.checkReveal = checkReveal;
		upc.goBack = goBack;
		upc.activateTab = activateTab;
		upc.isTabActive = isTabActive;

		activate();

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
			postService.getAllPosts(upc.params).then(function(res){
				upc.postsList = res.data.docs;
			});
		}
		function activateTab(tabIndex){
			upc.activeTab = tabIndex;
		}
		function isTabActive(tabIndex){
			return tabIndex === upc.activeTab;
		}
		function sendReveal() {
			$ionicActionSheet.show({
				titleText: 'Reveal',
				buttons: [
					{ text: '<i class="icon ion-share"></i> Send Reveal Request' },
				],
				
				cancelText: 'Cancel',
				cancel: function() {
				},
				buttonClicked: function(index) {
					revealService.initiate($stateParams.user).then(function(res){
						checkReveal();
					}).catch(function(err){
						window.alert(JSON.stringify(err));
					});
					return true;
				}
			});
		}

		function cancelReveal() {
			$ionicActionSheet.show({
				titleText: 'Reveal',
				buttons: [
					{ text: '<i class="icon ion-share"></i> Delete Reveal Request' },
				],
				
				cancelText: 'Cancel',
				cancel: function() {
					console.log('CANCELLED');
				},
				buttonClicked: function(index) {
					revealService.cancel($stateParams.user).then(function(res){
						checkReveal();
					}).catch(function(err){
						window.alert(JSON.stringify(err));
					});
					return true;
				}
			});
		}

		function decideReveal() {
			$ionicActionSheet.show({
				titleText: 'Reveal',
				buttons: [
					{ text: '<i class="icon ion-share"></i> Accept Reveal Request' },
					{ text: '<i class="icon ion-share"></i> Deny Reveal Request' },
				],
				
				cancelText: 'Cancel',
				cancel: function() {
					console.log('CANCELLED');
				},
				buttonClicked: function(index) {
					if(index===0){
						revealService.accept($stateParams.user).then(function(res){
							checkReveal();
						}).catch(function(err){
							window.alert(JSON.stringify(err));
						});
					
					}
					else if(index===1){
						revealService.ignore($stateParams.user).then(function(res){
							checkReveal();
						}).catch(function(err){
							window.alert(JSON.stringify(err));
						});
					
					}
					return true;
					
				}
			});
		}

		function deleteReveal() {
			$ionicActionSheet.show({
				titleText: 'Reveal',
				buttons: [
					{ text: '<i class="icon ion-share"></i> Delete Reveal ' },
				],
				
				cancelText: 'Cancel',
				cancel: function() {
					console.log('CANCELLED');
				},
				buttonClicked: function(index) {
					if(index===0){
						revealService.finish($stateParams.user).then(function(res){
							checkReveal();
						}).catch(function(err){
							window.alert(JSON.stringify(err));
						});
					
					}
					return true;
					
				}
			});
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
				
			});
		}
	}
})(window.angular);
