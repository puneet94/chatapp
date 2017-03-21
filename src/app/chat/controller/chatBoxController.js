(function(angular) {
	'use strict';
	angular.module('app.chat')

	.controller('ChatBoxController', ['$scope', 'Socket', '$stateParams', 'userData', 'chatService', 'userService', ChatBoxController]);

	function ChatBoxController($scope, Socket, $stateParams, userData, chatService, userService) {
		var cbc = this;

		cbc.currentUser = userData.getUser()._id;
		cbc.receiverUser = '';
		cbc.chatList = [];
		cbc.chatRoomId = '';
		cbc.messageLoading = false;
		activate();

		function getChatMessages() {
			chatService.getChatMessages(cbc.chatRoomId).then(function(res) {
				angular.forEach(res.data[0].chats, function(chat) {
					cbc.chatList.push(chat);
				});
			}, function(res) {
				console.log(res);
			});

		}
		function activate() {
			chatService.getChatRoom($stateParams.user).then(function(res) {
				console.log("the response the room");
				console.log(res);
				cbc.chatRoomId = res.data._id;
				cbc.currentUser = res.data.creator1;
				cbc.receiverUserId = res.data.creator2;
				console.log("the reciver id" + cbc.receiverUserId);
				console.log("the reciver id2" + cbc.currentUser);
				socketJoin();
				getChatMessages();

				
			}, function(res) {
				console.log(res);
			});
		}


		function socketJoin() {
			Socket.emit('addToRoom', { 'roomId': cbc.chatRoomId });
			Socket.on('messageSaved', function(message) {
				cbc.chatList.push(message);
				//$('.chatBoxUL').animate({ scrollTop: 99999999 }, 'slow');
			});
		}

		cbc.clickSubmit = function() {

			cbc.messageLoading = true;
			var chatObj = { 'message': cbc.myMsg, 'user': cbc.currentUser, 'roomId': cbc.chatRoomId };
			chatService.sendChatMessage(chatObj).then(function(res) {
				cbc.myMsg = ' ';
				cbc.messageLoading = false;
				console.log(res);
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
