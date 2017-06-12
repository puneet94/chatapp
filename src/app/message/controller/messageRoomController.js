(function(angular) {
	'use strict';
	angular.module('petal.message')

	.controller('MessageRoomController', ['$scope', '$timeout', 'Socket', '$stateParams', 'userData', 'homeService', 'messageRoomService', '$ionicScrollDelegate', 'userService', 'Upload', '$ionicLoading', '$window','messageRoom', MessageRoomController]);

	function MessageRoomController($scope, $timeout, Socket, $stateParams, userData, homeService, messageRoomService, $ionicScrollDelegate, userService, Upload, $ionicLoading, $window,messageRoom) {
		var cbc = this;
		
		cbc.currentUser = userData.getUser()._id;
		
		cbc.messageList = [];
		cbc.messageRoom = messageRoom;
		
		cbc.loadMoreMessages = loadMoreMessages;
		cbc.scrollBottom = scrollBottom;
		cbc.messageLoading = false;
		cbc.formatMessageDate = function(messageDate){
			return window.moment(messageDate).format(" MMM Do, h:mm a");
		};
		cbc.params = {
			page: 1,
			limit: 5
		};
		activate();

		function loadMoreMessages() {
			cbc.params.page += 1;
			getMessages();
		}

		
		function scrollBottom() {
			$timeout(function() {
				$ionicScrollDelegate.scrollBottom(true);
			});

		}

		function getMessages() {
			messageRoomService.getMessages(messageRoom._id,cbc.params).then(function(res) {
				console.log("get messages");
				console.log(res);
				angular.forEach(res.data.docs, function(message) {
					cbc.messageList.unshift(message);
				});
				console.log(cbc.messageList);
			}).catch(function(res) {

				console.log(res);
			}).finally(function() {
				scrollBottom();
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			$ionicLoading.show();
			getMessages();
			socketJoin();

		}


		function socketJoin() {
			Socket.emit('addToMessagetRoom', { 'roomId': messageRoom._id });
			Socket.on('roomMessageReceived', function(message) {
				console.log("received message");
				console.log(message);
				cbc.messageList.push(message);
				scrollBottom();
				cbc.messageLoading = false;
			});

		}

		cbc.clickSubmit = function($event) {

			cbc.messageLoading = true;
			cbc.focusInput = true;
			
			if (window.cordova ) {
				
				window.cordova.plugins.Keyboard.show();
				//window.cordova.fireWindowEvent('native.keyboardshow', {'keyboardHeight': +262});
            				window.cordova.plugins.Keyboard.isVisible = true;
			}
			//scrollBottom();
			var messageObj = { 'message': cbc.myMsg, 'roomId': cbc.messageRoom._id };

			messageRoomService.sendMessage(messageObj).then(function(res) {
				console.log(res);
				cbc.myMsg = '';
				//cbc.messageList.push(res.data.savedMessage);
				scrollBottom();
			}).catch(function(err) {
				console.log(err);
			}).finally(function() {
				cbc.messageLoading = false;
			});

			$event.preventDefault();

		};


		cbc.submitUpload = function() {
			cbc.messageLoading = true;
			cbc.file.upload = Upload.upload({
				url: homeService.baseURL + 'upload/singleUpload',
				data: { file: cbc.file }
			});

			cbc.file.upload.then(function(response) {
				cbc.file.result = response.data;
				cbc.uploadedImage = response.data;
				cbc.cancelUpload();
				var messageObj = { 'message': cbc.uploadedImage,  'roomId': cbc.messageRoom._id, type: 'img' };
				messageRoomService.sendMessage(messageObj).then(function(res) {
					scrollBottom();
					//cbc.messageList.push(res.data.message);
					cbc.messageLoading = false;
				}).catch(function(err) {
					console.log(err);

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
		cbc.leaveMessageRoom = function() {
			Socket.emit('removeFromMessageRoom', { 'roomId': cbc.messageRoom._id });

			$window.history.back();


		};

	}
})(window.angular);

/*userService.getUserDetails(cbc.receiverUserIDId, { 'fields': 'displayName firstName' }).then(function(response) {
					console.log("the receiver");
					console.log(response.data);
					cbc.receiverUserID = response.data.displayName || (response.data.firstName);
				});*/
