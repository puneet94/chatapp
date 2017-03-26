(function(angular) {
	'use strict';
	angular.module('petal.home')
		.controller('HomeController', ['$scope', '$state', 'userData', 'Socket', 'toastr', '$stateParams', HomeController]);

	function HomeController($scope, $state, userData, Socket, toastr, $stateParams) {
		var hc = this;
		hc.badgeValue = '';
		hc.chatClicked = chatClicked;


		Socket.on("connect", function() {
			Socket.emit('addToSingleRoom', { 'roomId': userData.getUser()._id });
		});
		Socket.on('messageReceived', function(message) {
			console.log(message);
			if (message.user._id == userData.getUser()._id) {

			} else {
				if ($state.current.name == 'chatBox') {
					if ($stateParams.user != message.user._id) {
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
		});

		function chatClicked() {
			hc.badgeValue = '';
			$state.go('home.chat.all');
		}
	}
})(window.angular);
