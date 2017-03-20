(function(angular) {
	'use strict';
	angular.module('petal.chat', [])
		.config(['$stateProvider', config]);


	function config($stateProvider) {
		$stateProvider
			.state('home.chat',{
				url: '/chat',
				abstract: true,
				views: {
					'chat-tab': {
						templateUrl: 'app/chat/views/chatParent.html',
						controller: 'ChatParentController',
						controllerAs: 'ppc'
					}
				}
				
			}).state('home.chat.all',{
				url: '/all',
				
				views: {
					'chat-tab': {
						templateUrl: 'app/chat/views/allChat.html',
						controller: 'AllChatController',
						controllerAs: 'apc'
					}
				}				
			}).state('home.chat.revealed',{
				url: '/revealed',
				
				views: {
					'chat-tab': {
						templateUrl: 'app/chat/views/revealedChat.html',
						controller: 'RevealedChatController',
						controllerAs: 'rpc'
					}
				}				
			});
	}
})(window.angular);
