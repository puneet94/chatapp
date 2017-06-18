(function(angular) {
	'use strict';
	angular.module('petal.message')
		.service('messageRoomService', ['$http', '$stateParams', 'homeService', MessageRoomService]);

	function MessageRoomService($http, $stateParams, homeService) {
		var rs = this;
		rs.sendMessage = sendMessage;
		rs.getMessages = getMessages;
		rs.getMessageRoom = getMessageRoom;
		rs.getMessageRooms = getMessageRooms;
		rs.leaveMessageRoom = leaveMessageRoom;
		
		function sendMessage(message) {
			
			return $http.post(homeService.baseURL + 'message/create/' + message.roomId, message);
		}

		function getMessages(messageRoomId,params) {
			
			return $http.get(homeService.baseURL + 'message/getMessages/' + messageRoomId,{params:params});
		}

		function getMessageRoom(params) {
			
			return $http.get(homeService.baseURL + 'messageRoom/getRoom/',{params:params} );

		}
		function leaveMessageRoom(messageRoomId) {
			
			return $http.post(homeService.baseURL + 'messageRoom/leaveRoom/',{messageRoomId:messageRoomId} );

		}
		function getMessageRooms() {
			
			return $http.get(homeService.baseURL + 'messageRoom/getRooms/' );

		}
		
		


	}
})(window.angular);
