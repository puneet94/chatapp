(function(angular) {
	'use strict';
	angular.module('petal.message')
		.service('messageRoomService', ['$http', '$stateParams', 'homeService', MessageRoomService]);

	function MessageRoomService($http, $stateParams, homeService) {
		var rs = this;
		rs.sendMessage = sendMessage;
		rs.getMessages = getMessages;
		rs.getMessageRoom = getMessageRoom;
		rs.createMessageRoom = createMessageRoom;
		rs.getMessageRooms = getMessageRooms;
		rs.leaveMessageRoom = leaveMessageRoom;
		rs.getAllMessageRooms = getAllMessageRooms;
		
		function sendMessage(message) {
			
			return $http.post(homeService.baseURL + 'message/create/' + message.roomId, message);
		}

		function getMessages(messageRoomId,params) {
			
			return $http.get(homeService.baseURL + 'message/getMessages/' + messageRoomId,{params:params});
		}

		function getMessageRoom(params) {
			
			return $http.get(homeService.baseURL + 'messageRoom/getRoom/',{params:params} );

		}
		function createMessageRoom(messageRoom){
			return $http.post(homeService.baseURL + 'messageRoom/createRoom' , {messageRoom:messageRoom});	
		}
		function leaveMessageRoom(messageRoomId) {
			
			return $http.post(homeService.baseURL + 'messageRoom/leaveRoom/',{messageRoomId:messageRoomId} );

		}
		function getMessageRooms() {
			
			return $http.get(homeService.baseURL + 'messageRoom/getRooms/' );

		}
		function getAllMessageRooms(params){
			return $http.get(homeService.baseURL+'messageRoom/getAllRooms',{params:params});
		}
		
		


	}
})(window.angular);
