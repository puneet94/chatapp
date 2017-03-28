(function(angular){
	'use strict';
	angular.module('petal.chat')
		.controller('RevealedChatController',['$scope','$state','chatService',RevealedChatController]);

	function RevealedChatController($scope,$state,chatService){
		var acc = this;
		acc.params = {
			page: 1,
			limit: 25
		};
		acc.chatRoomsList = [];
		acc.getRevealedChatRooms = getRevealedChatRooms;
		acc.loadMoreChats = loadMoreChats;
		acc.pullRefreshChats = pullRefreshChats;
		activate();

		function pullRefreshChats() {
			acc.params.page = 1;
			acc.chatRoomsList = [];
			getRevealedChatRooms();

		}

		function loadMoreChats() {
			acc.params.page += 1;
			getRevealedChatRooms();
		}

		function getRevealedChatRooms() {
			chatService.getRevealedChatRooms(acc.params).then(function(response){
				console.log("Chatrroms");
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					acc.chatRoomsList.push(value);
				});
			});
		}

		function activate() {
			getRevealedChatRooms();
		}
	}
})(window.angular);