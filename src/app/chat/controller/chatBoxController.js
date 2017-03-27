(function(angular) {
	'use strict';
	angular.module('petal.chat')

	.controller('ChatBoxController', ['$scope', '$timeout', '$ionicModal', 'Socket', '$stateParams', 'userData', 'homeService', 'chatService', '$ionicScrollDelegate', 'userService', 'Upload', '$state',ChatBoxController]);

	function ChatBoxController($scope, $timeout, $ionicModal, Socket, $stateParams, userData, homeService, chatService, $ionicScrollDelegate, userService, Upload,$state) {
		var cbc = this;

		cbc.currentUser = userData.getUser()._id;
		cbc.receiverUserID = $stateParams.user;
		cbc.chatList = [];
		cbc.chatRoomId = '';
		cbc.loadMoreChats = loadMoreChats;
		cbc.scrollBottom = scrollBottom;
		
		cbc.showImageModal = showImageModal;
		cbc.messageLoading = false;
		cbc.params = {
			page: 1,
			limit: 5
		};
		activate();

		function loadMoreChats() {
			cbc.params.page += 1;
			getChatMessages();
		}

		function getReceiver() {
			userService.getUser(cbc.receiverUserID).then(function(response) {
				cbc.receiverUser = response.data;
			}).catch(function(err) {
				window.alert(err);
				console.log(err);
			});
		}

		function scrollBottom() {
			cbc.messageLoading = false;
			$timeout(function() {
				$ionicScrollDelegate.scrollBottom(true);
			});
			
		}
		
		function getChatMessages() {
			chatService.getChatMessages(cbc.chatRoomId, cbc.params).then(function(res) {

				angular.forEach(res.data.docs, function(chat) {
					cbc.chatList.unshift(chat);
				});
			}).catch(function(res) {
				window.alert(JSON.stringify(res));
				console.log(res);
			}).finally(function() {
				scrollBottom();
				$scope.$broadcast('scroll.refreshComplete');
			});

		}

		function activate() {
			chatService.getChatRoom(cbc.receiverUserID).then(function(res) {
				console.log(res);
				cbc.chatRoom = res.data;
				cbc.chatRoomId = res.data._id;

				socketJoin();
				getChatMessages();
			}, function(res) {
				window.alert(JSON.stringify(res));
			});
			getReceiver();


			loadModal();
		}
		function showImageModal(image){
			$scope.currentImage = image;
			$scope.modal.show();
		}
		function loadModal() {
			$ionicModal.fromTemplateUrl('app/chat/views/chatImageModal.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modal = modal;
			});
		}

		function socketJoin() {
			Socket.emit('addToChatRoom', { 'roomId': cbc.chatRoomId });
			Socket.on('messageReceived', function(message) {
				scrollBottom();
				cbc.chatList.push(message);
			});
			Socket.on('messageSaved', function(message) {
				scrollBottom();
				cbc.chatList.push(message);
			});
		}

		cbc.clickSubmit = function() {
			cbc.focusInput = true;

			/*if(window.cordova && (!window.cordova.plugins.Keyboard.isVisible)){
				window.cordova.plugins.Keyboard.show();
			}*/
			cbc.messageLoading = true;
			var chatObj = { 'message': cbc.myMsg, receiver: $stateParams.user, 'roomId': cbc.chatRoomId };
			chatService.sendChatMessage(chatObj).then(function(res) {
				cbc.myMsg = '';
				scrollBottom();
			}).catch(function(err) {
				window.alert(JSON.stringify(err));
			});


		};


		cbc.submitUpload = function() {
			cbc.file.upload = Upload.upload({
				url: homeService.baseURL + 'upload/singleUpload',
				data: { file: cbc.file }
			});

			cbc.file.upload.then(function(response) {
				cbc.file.result = response.data;
				cbc.uploadedImage = response.data;
				cbc.cancelUpload();
				var chatObj = { 'message': cbc.uploadedImage, receiver: $stateParams.user, 'roomId': cbc.chatRoomId, type: 'img' };
				chatService.sendChatMessage(chatObj).then(function(res) {
					scrollBottom();

				}).catch(function(err) {

					window.alert(err);
				});

			});
		};
		cbc.cancelUpload = function() {
			cbc.showTempImage = false;
			cbc.tempImageUrl = '';
		};
		cbc.uploadSingleImage = function(file, errFiles) {
			cbc.file = file;
			cbc.errFile = errFiles && errFiles[0];
			if (file) {
				cbc.showTempImage = true;
				cbc.tempImageUrl = file;
				scrollBottom();
			}
		};
		cbc.leaveChatBox = function(){
			Socket.emit('removeFromRoom', { 'roomId': cbc.chatRoomId });
			chatService.updateChatRoom(cbc.chatRoomId).then(function(res){
				console.log("update chat");
				console.log(res);
			}).catch(function(err){
				console.log(err);
				window.alert(JSON.stringify(err));
			}).finally(function(){
				
				$state.go('home.chat.all',{},{reload:true});
			});
			
		};

	}
})(window.angular);

/*userService.getUserDetails(cbc.receiverUserIDId, { 'fields': 'displayName firstName' }).then(function(response) {
					console.log("the receiver");
					console.log(response.data);
					cbc.receiverUserID = response.data.displayName || (response.data.firstName);
				});*/
