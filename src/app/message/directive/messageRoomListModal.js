(function(angular) {
	'use strict';
	var messageRoomModule = angular.module('petal.message');
	messageRoomModule.directive('messageRoomListModal', ['$rootScope','$ionicModal', 'messageRoomService',messageRoomListModal]);

	function messageRoomListModal($rootScope,$ionicModal, messageRoomService) {
		return {
			restrict: 'A',
			scope: {
				messageRoomListModal: '@'
			},
			link: function(scope, elem) {
				
				scope.messageRoomListData = {};
				scope.messageRoomListData.messageRoomsList = [];
				scope.modalsList = [];
				scope.clickMessageRoomSearch = clickMessageRoomSearch;
				scope.showMessageRoomModal = function() {
					loadMessageRoomModal().then(function() {
						scope.modal.show();
						
					});
					scope.$on('modal.hidden', function() {

						scope.modal.remove();
					});
				};
				$rootScope.$on('$stateChangeStart', function() {
					if(scope.modal){
						scope.modal.remove();	
					}
   					
				});
				scope.getMessageRooms = function(params) {
					
					messageRoomService.getAllMessageRooms(params).then(function(response) {
						scope.messageRoomListData.messageRoomsList = [];
						angular.forEach(response.data.docs, function(value) {
							scope.messageRoomListData.messageRoomsList.push(value);
						});
						scope.messageRoomListData.noMessageRooms = !response.data.total;
						scope.messageRoomListData.initialSearchCompleted = true;
						if (response.data.total > scope.messageRoomListData.messageRoomsList.length) {
							scope.messageRoomListData.canLoadMoreResults = true;
						} else {
							scope.messageRoomListData.canLoadMoreResults = false;
						}
					});
				};
				function clickMessageRoomSearch(){
					scope.messageRoomListData.messageRoomsList = [];
					var params = {
						interest: scope.messageRoomListData.messageRoomSearchModal ,
						page: 1,
						limit: 50
					};
					scope.getMessageRooms(params);
				}
				function loadMessageRoomModal() {
					return $ionicModal.fromTemplateUrl('app/message/views/messageRoomListModal.html', {
						scope: scope
					}).then(function(modal) {
						scope.modal = modal;
						
					});
				}
				elem.bind('click', function(event) {
					var params = {
						page: 1,
						limit: 50
					};
					scope.showMessageRoomModal();
					event.stopPropagation();
					scope.getMessageRooms(params);
				});
			}
		};

	}

})(window.angular);
