(function(angular) {
	'use strict';
	angular.module('petal.chat')
		.service('chatService', ['$http', '$stateParams', 'homeService', ReviewService]);

	function ReviewService($http, $stateParams, homeService) {
		var rs = this;
		rs.sendChatMessage = sendChatMessage;
		rs.getChatMessages = getChatMessages;
		rs.getChatRoom = getChatRoom;
		rs.getAllChatRooms = getAllChatRooms;
		rs.getRevealedChatRooms = getRevealedChatRooms;
		rs.updateChatRoom = updateChatRoom;

		function sendChatMessage(chat) {
			console.log("chat messgae");
			console.log(chat);
			return $http.post(homeService.baseURL + 'chat/create/' + chat.roomId, chat);
		}

		function getChatMessages(chatRoomId,params) {
			console.log("params");
			console.log(params);
			return $http.get(homeService.baseURL + 'chat/getChats/' + chatRoomId,{params:params});
		}

		function getChatRoom(user) {
			console.log("get chat room");
			console.log(user);
			return $http.get(homeService.baseURL + 'chatRoom/get/' + user);

		}
		function getAllChatRooms(params) {
			params.revealed = false;
			return $http.get(homeService.baseURL + 'chatRoom/all/',{params:params});

		}
		function getRevealedChatRooms(params) {
			params.revealed = true;
			return $http.get(homeService.baseURL + 'chatRoom/all/',{params:params});

		}
		function updateChatRoom(id){
			return $http.post(homeService.baseURL+'chatRoom/'+id);
		}

		


	}
})(window.angular);
