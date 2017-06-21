(function(angular){
	'use strict';

	var messageModule = angular.module('petal.message',[]);
	messageModule.config(['$stateProvider', config]);


	function config($stateProvider) {
		$stateProvider
			.state('messageRoomInterest', {
				url: '/messageRoom/interest/post/:interest/:postId',
				templateUrl: 'app/message/views/messageRoom.html',
				controller: 'MessageRoomController',
				controllerAs: 'mrc',
				resolve: {
					messageRoom: [ '$stateParams', '$q', 'messageRoomService',messageRoom]
				}

			}).state('messageRoom', {
				url: '/messageRoom/:roomId',
				templateUrl: 'app/message/views/messageRoom.html',
				controller: 'MessageRoomController',
				controllerAs: 'mrc',
				resolve: {
					messageRoom: [ '$stateParams', '$q', 'messageRoomService',messageRoom]
				}
			}).state('messageRoomCreate', {
				url: '/messageRoomCreate',
				templateUrl: 'app/message/views/messageRoomCreate.html',
				controller: 'MessageRoomCreateController',
				controllerAs: 'mrcc'
			});
	}

	function messageRoom($stateParams,$q,messageRoomService){
		var defer = $q.defer();
		var params = {};
		if($stateParams.postId){
			params.postId = $stateParams.postId;
		} 
		if($stateParams.interest){
			params.interest = $stateParams.interest;
		}
		if($stateParams.roomId){
			params.roomId = $stateParams.roomId;
		}
		
		messageRoomService.getMessageRoom(params).then(function(response){
			defer.resolve(response.data.foundMessageRoom);					
		}).catch(function(e){
			console.log("Resolve mesage Room");
			console.log(e);
			//defer.resolve();	
		});
		return defer.promise;
	}
})(window.angular);