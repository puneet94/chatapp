(function(angular) {
	'use strict';
	angular.module('petal.message')
		.directive('messageRoomSettings', ['messageRoomService', '$ionicPopover','$window',messageRoomSettings]);

	function messageRoomSettings(messageRoomService,$ionicPopover,$window) {
		return {
			restrict: 'A',
			scope: {
				messageRoomId: '@messageRoomId'
			},
			link: function(scope,elem) {
				scope.openMessageSettings = openMessageSettings;
				elem.bind('click',function($event){
					scope.openMessageSettings($event);
				});
				function openMessageSettings($event) {

					$ionicPopover.fromTemplateUrl('app/message/views/messageRoomSettings.html', {
						scope: scope
					}).then(function(popover) {
						
						scope.popover = popover;
						scope.popover.show($event);
					}).catch(function(e){
						window.console.log("error pops");
						window.console.log(e);
					});
				}
				scope.leaveRoom = function() {
					messageRoomService.leaveMessageRoom(scope.messageRoomId).then(function() {
						scope.popover.remove();
						$window.history.back();
					}).catch(function(err){
						
						window.console.log(err);
						$window.history.back();
					});
				};

			}
		};
	}
})(window.angular);
