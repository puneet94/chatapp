(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserPageController', ['$state', '$auth', 'userService', 'revealService','$stateParams', '$ionicActionSheet',UserPageController]);

	function UserPageController($state, $auth, userService, revealService,$stateParams,$ionicActionSheet) {

		var upc = this;
		upc.sendReveal = sendReveal;
		upc.cancelReveal = cancelReveal;
		upc.decideReveal = decideReveal;
		upc.deleteReveal = deleteReveal;
		upc.checkReveal = checkReveal;

		activate();

		function activate() {
			getUser();
			checkReveal();
		}


		function sendReveal() {
			$ionicActionSheet.show({
				titleText: 'Reveal',
				buttons: [
					{ text: '<i class="icon ion-share"></i> Send Reveal Request' },
				],
				
				cancelText: 'Cancel',
				cancel: function() {
					console.log('CANCELLED');
				},
				buttonClicked: function(index) {
					console.log('BUTTON CLICKED', index);
					revealService.initiate($stateParams.user).then(function(res){
						console.log("intitiate reveal response");
						console.log(res);
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
		function getUser() {
			userService.getUser($stateParams.user).then(function(response) {
				console.log(":page user");
				console.log(response);
				upc.user = response.data;
			});
		}
	}
})(window.angular);
