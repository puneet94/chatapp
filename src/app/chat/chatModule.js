(function(angular) {
	'use strict';
	angular.module('petal.chat', ['ngFileUpload'])
		.config(['$stateProvider', config]);


	function config($stateProvider) {
		$stateProvider
			.state('home.chat', {
				url: '/chat',
				abstract: true,
				views: {
					'chat-tab': {
						templateUrl: 'app/chat/views/chatParent.html',
						controller: 'ChatParentController',
						controllerAs: 'ppc'
					}
				}

			}).state('home.chat.all', {
				url: '/all',

				views: {
					'chat-tab': {
						templateUrl: 'app/chat/views/allChat.html',
						controller: 'AllChatController',
						controllerAs: 'acc'
					}
				}
			}).state('home.chat.revealed', {
				url: '/revealed',

				views: {
					'chat-tab': {
						templateUrl: 'app/chat/views/revealedChat.html',
						controller: 'RevealedChatController',
						controllerAs: 'rpc'
					}
				}
			}).state('home.chat.messageroom', {
				url: '/messageRoom',

				views: {
					'chat-tab': {
						templateUrl: 'app/chat/views/messageRoomList.html',
						controller: 'MessageRoomListController',
						controllerAs: 'mrlc'
					}
				}
			}).state('chatBox', {
				url: '/chatBox/:user',
				templateUrl: 'app/chat/views/chatBox.html',
				controller: 'ChatBoxController',
				controllerAs: 'cbc',
				resolve: {
					blocked: [ '$stateParams', 'blockService','$q', blocked]

				}

			});
	}

	function blocked($stateParams,blockService,$q){
		var defer = $q.defer();
		blockService.check($stateParams.user).then(function(response){
			defer.resolve(response.data.blocked);					
		}).catch(function(){
			defer.resolve();	
		});
		return defer.promise;
	}

})(window.angular);
