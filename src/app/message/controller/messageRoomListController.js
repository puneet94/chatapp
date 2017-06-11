(function(angular) {
	'use strict';
	angular.module('petal.message')
		.controller('MessageRoomListController', ['$scope', '$state', 'messageRoomService', '$ionicLoading', 'Socket',MessageRoomListController]);

	function MessageRoomListController($scope, $state, messageRoomService, $ionicLoading,Socket) {
		var acc = this;
		acc.getAllMessageRooms = getAllMessageRooms;
		acc.loadMoreMessages = loadMoreMessages;
		acc.pullRefreshMessages = pullRefreshMessages;
		activate();
		Socket.on('newRoomMessageReceived', messageReceived);
		
		acc.messageRoomPage = function(messageRoom){
			console.log(messageRoom);
			if(messageRoom.interest){
				$state.go('messageRoomInterest', { interest: messageRoom.interest});	
			}else{
				console.log("yo");
				$state.go('messageRoomPost', { postId: messageRoom.post._id});	
			}
			
		};
		function messageReceived(message){
			var newMessageRoom = {};
			newMessageRoom.newMessage = true;
			newMessageRoom.lastMessage = {
				_id:message._id,
				message:message.message,
				type: message.type
			};
		

			for(var ch=0;ch<acc.messageRoomsList.length;ch++){
				if(newMessageRoom.creator2._id==acc.messageRoomsList[ch].creator2._id){
					if (newMessageRoom.lastMessage._id !== acc.messageRoomsList[ch].lastMessage._id) {
						acc.messageRoomsList.splice(ch,1);
						acc.messageRoomsList.unshift(newMessageRoom);
						return;
					}
			}
			}
			
		}
		function pullRefreshMessages() {
			activate();
		}

		function loadMoreMessages() {
			acc.params.page += 1;
			getAllMessageRooms();
		}

		function getAllMessageRooms() {
			messageRoomService.getMessageRooms().then(function(response) {
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					acc.messageRoomsList.push(value);
				});
				acc.noPosts =!response.data.total;
				
				acc.initialSearchCompleted = true;
				if (response.data.total > acc.messageRoomsList.length) {
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
			acc.messageRoomsList = [];
			getAllMessageRooms();
		}
	}
})(window.angular);
