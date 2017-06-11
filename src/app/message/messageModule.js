(function(angular){
	'use strict';

	var messageModule = angular.module('petal.message',[]);
	messageModule.config(['$stateProvider', config]);


	function config($stateProvider) {
		$stateProvider
			.state('messageRoomInterest', {
				url: '/messageRoom/interest/:interest',
				templateUrl: 'app/message/views/messageRoom.html',
				controller: 'MessageRoomController',
				controllerAs: 'mrc',
				resolve: {
					messageRoom: [ '$stateParams', '$q', 'messageRoomService',messageRoom]

				}

			}).state('messageRoomPost', {
				url: '/messageRoom/post/:postId',
				templateUrl: 'app/message/views/messageRoom.html',
				controller: 'MessageRoomController',
				controllerAs: 'mrc',
				resolve: {
					messageRoom: [ '$stateParams', '$q', 'messageRoomService',messageRoom]

				}

			});
	}

	function messageRoom($stateParams,$q,messageRoomService){
		var defer = $q.defer();
		var params = {};
		if($stateParams.postId){
			params.postId = $stateParams.postId;
		}else{
			params.interest = $stateParams.interest;
		}
		messageRoomService.getMessageRoom(params).then(function(response){
			console.log("resolve response");
			console.log(response);
			defer.resolve(response.data.foundMessageRoom);					
		}).catch(function(e){
			console.log("Resolve mesage Room");
			console.log(e);
			//defer.resolve();	
		});
		return defer.promise;
	}
})(window.angular);