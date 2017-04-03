(function(angular) {
	'use strict';
	angular.module('petal.home')
		.controller('HomeController', ['$scope', '$state', 'userData', 'Socket', 'toastr', '$ionicTabsDelegate',HomeController]);

	function HomeController($scope, $state, userData, Socket, toastr,$ionicTabsDelegate) {
		var hc = this;
		hc.badgeValue = '';
		hc.chatClicked = chatClicked;


		Socket.on("connect", function() {
			Socket.emit('addToSingleRoom', { 'roomId': userData.getUser()._id });
			Socket.on('newMessageReceived', messageReceived);
		});

		function messageReceived(message) {
			console.log(message);
			if (message.user._id == userData.getUser()._id) {

			} else {
				if ($state.current.name == 'chatBox') {

					if ($state.params.user != message.user._id) {
						toastr.info('<p>' + message.user.anonName + '</p><p>' + message.message + '</p>', {
							allowHtml: true,
							onTap: function() {
								$state.go('chatBox', { user: message.user._id });
							}
						});
					}
				} else {

					toastr.info('<p>' + message.user.anonName + '</p><p>' + message.message + '</p>', {
						allowHtml: true,
						onTap: function() {
							$state.go('chatBox', { user: message.user._id });
						}
					});
					hc.badgeValue = 1;

				}


			}
		}
		hc.goForward = function() {
			
			var selected = $ionicTabsDelegate.selectedIndex();
			if (selected != -1) {
				if(selected===1){
					$ionicTabsDelegate.select(selected + 2);	
				}
				else{
					$ionicTabsDelegate.select(selected + 1);	
				}
				
			}
		};

		hc.goBack = function() {

			var selected = $ionicTabsDelegate.selectedIndex();
			if (selected !== -1 && selected !== 0) {
				if(selected===3){
					$ionicTabsDelegate.select(selected - 2);
				}
				else{
					$ionicTabsDelegate.select(selected - 1);
				}
			}
		};

		function chatClicked() {
			hc.badgeValue = '';
			//$state.go('home.chat.all');
		}
	}
})(window.angular);
