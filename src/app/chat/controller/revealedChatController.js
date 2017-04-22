(function(angular){
	'use strict';
	angular.module('petal.chat')
		.controller('RevealedChatController',['$scope','$state','chatService','$ionicLoading','Socket',RevealedChatController]);

	function RevealedChatController($scope,$state,chatService,$ionicLoading,Socket){
		var acc = this;
		acc.getRevealedChatRooms = getRevealedChatRooms;
		acc.loadMoreChats = loadMoreChats;
		acc.pullRefreshChats = pullRefreshChats;
		activate();
		
		function pullRefreshChats() {
			activate();
		}

		function loadMoreChats() {
			acc.params.page += 1;
			getRevealedChatRooms();
		}

		function getRevealedChatRooms() {
			chatService.getRevealedChatRooms(acc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					acc.chatRoomsList.push(value);
				});
				acc.noPosts =!response.data.total;

				console.log(acc.chatRoomsList);
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
			getRevealedChatRooms();
		}
	}
})(window.angular);