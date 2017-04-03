(function(angular) {
	'use strict';
	angular.module('petal.chat')
		.controller('AllChatController', ['$scope', '$state', 'chatService','$ionicLoading', AllChatController]);

	function AllChatController($scope, $state,chatService,$ionicLoading) {
		var acc = this;
		acc.params = {
			page: 1,
			limit: 25
		};
		acc.chatRoomsList = [];
		acc.getAllChatRooms = getAllChatRooms;
		acc.loadMoreChats = loadMoreChats;
		acc.pullRefreshChats = pullRefreshChats;
		activate();

		function pullRefreshChats() {
			acc.params.page = 1;
			acc.chatRoomsList = [];
			getAllChatRooms();

		}

		function loadMoreChats() {
			acc.params.page += 1;
			getAllChatRooms();
		}

		function getAllChatRooms() {
			chatService.getAllChatRooms(acc.params).then(function(response){
				console.log("all chats");

				angular.forEach(response.data.docs, function(value) {
					acc.chatRoomsList.push(value);
				});
				console.log(acc.chatRoomsList);
			}).finally(function(){
				$ionicLoading.hide();
			});
		}

		function activate() {
			getAllChatRooms();
		}
	}
})(window.angular);
