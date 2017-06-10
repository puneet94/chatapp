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
		
		function sendMessage(message) {
			
			return $http.post(homeService.baseURL + 'message/create/' + message.roomId, message);
		}

		function getMessages(messageRoomId,params) {
			
			return $http.get(homeService.baseURL + 'message/getMessages/' + messageRoomId,{params:params});
		}

		function getMessageRoom(user) {
			
			return $http.get(homeService.baseURL + 'messageRoom/get/' + user);

		}
		function getMessageRooms(user) {
			
			return $http.get(homeService.baseURL + 'messageRoom/get/' + user);

		}
		
		


	}
})(window.angular);
