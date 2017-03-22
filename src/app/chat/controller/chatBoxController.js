(function(angular) {
	'use strict';
	angular.module('petal.chat')

	.controller('ChatBoxController', ['$scope', 'Socket', '$stateParams', 'userData', 'chatService' ,'$ionicScrollDelegate',ChatBoxController]);

	function ChatBoxController($scope, Socket, $stateParams, userData, chatService,$ionicScrollDelegate) {
		var cbc = this;

		cbc.currentUser = userData.getUser()._id;
		cbc.receiverUser = $stateParams.user;
		cbc.chatList = [];
		cbc.chatRoomId = '';
		cbc.messageLoading = false;
		activate();

		function getChatMessages() {
			chatService.getChatMessages(cbc.chatRoomId).then(function(res) {
				
				angular.forEach(res.data.docs, function(chat) {
					cbc.chatList.push(chat);
				});
			}).catch(function(res) {
				console.log(res);
			}).finally(function(){
				$ionicScrollDelegate.scrollBottom(true);
			});

		}
		function activate() {
			chatService.getChatRoom(cbc.receiverUser).then(function(res) {
				cbc.chatRoomId = res.data._id;
				socketJoin();
				getChatMessages();
			}, function(res) {
				console.log('the error in getting chatroom');
				console.log(res);
			});
		}


		function socketJoin() {
			console.log("socket joined");
			Socket.emit('addToChatRoom', { 'roomId': cbc.chatRoomId });
			Socket.on('messageReceived', function(message) {
				
				cbc.chatList.push(message);
				$ionicScrollDelegate.scrollBottom(true);
				//$('.chatBoxUL').animate({ scrollTop: 99999999 }, 'slow');
			});
			Socket.on('messageSaved', function(message) {
				
				cbc.chatList.push(message);
				$ionicScrollDelegate.scrollBottom(true);
				//$('.chatBoxUL').animate({ scrollTop: 99999999 }, 'slow');
			});
		}

		cbc.clickSubmit = function() {

			cbc.messageLoading = true;
			var chatObj = { 'message': cbc.myMsg,receiver:$stateParams.user, 'roomId': cbc.chatRoomId };
			chatService.sendChatMessage(chatObj).then(function(res) {
				cbc.myMsg = ' ';
				cbc.messageLoading = false;
				
			}, function(res) {
				console.log(res);
			});


		};

	}
})(window.angular);

/*userService.getUserDetails(cbc.receiverUserId, { 'fields': 'displayName firstName' }).then(function(response) {
					console.log("the receiver");
					console.log(response.data);
					cbc.receiverUser = response.data.displayName || (response.data.firstName);
				});*/
