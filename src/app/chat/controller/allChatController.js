(function(angular) {
	'use strict';
	angular.module('petal.chat')
		.controller('AllChatController', ['$scope', '$state', 'chatService', '$ionicLoading', 'Socket',AllChatController]);

	function AllChatController($scope, $state, chatService, $ionicLoading,Socket) {
		var acc = this;
		acc.getAllChatRooms = getAllChatRooms;
		acc.loadMoreChats = loadMoreChats;
		acc.pullRefreshChats = pullRefreshChats;
		activate();
		Socket.on('newMessageReceived', messageReceived);

		function messageReceived(message){
			var newChatRoom = {};
			newChatRoom.creator2 = message.user;
			newChatRoom.newChat = true;
			newChatRoom.lastMessage = {
				user:message.user._id,
				_id:message._id,
				message:message.message,
				type: message.type
			};
		

			for(var ch=0;ch<acc.chatRoomsList.length;ch++){
				if(newChatRoom.creator2._id==acc.chatRoomsList[ch].creator2._id){
					if (newChatRoom.lastMessage._id !== acc.chatRoomsList[ch].lastMessage._id) {
						acc.chatRoomsList.splice(ch,1);
						acc.chatRoomsList.unshift(newChatRoom);
						return;
					}
			}
			}
			
		}
		function pullRefreshChats() {
			activate();
		}

		function loadMoreChats() {
			acc.params.page += 1;
			getAllChatRooms();
		}

		function getAllChatRooms() {
			chatService.getAllChatRooms(acc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					acc.chatRoomsList.push(value);
				});
				acc.noPosts =!response.data.total;
				
				acc.initialSearchCompleted = true;
				if (response.data.total > acc.chatRoomsList.length) {
					acc.canLoadMoreResults = true;
				}
				else{
					acc.canLoadMoreResults = false;	
				}
			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});
		}

		function activate() {
			acc.canLoadMoreResults = false;
			acc.initialSearchCompleted = false;
			acc.params = {
				page: 1,
				limit: 25
			};
			acc.chatRoomsList = [];
			getAllChatRooms();
		}
	}
})(window.angular);
