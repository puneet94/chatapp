(function(angular) {

	'use strict';


	var app = angular.module('petal', ['ionic', 'ngAnimate','satellizer', 'ngFileUpload', 'btford.socket-io',
		'ngCordova', 'toastr', 'petal.home', 'petal.post', 'petal.chat', 'petal.user', 'petal.people','petal.message'
	]);
	app.config(['$urlRouterProvider', '$stateProvider', '$ionicConfigProvider', 'toastrConfig', configFunction]);

	function configFunction($urlRouterProvider, $stateProvider, $ionicConfigProvider, toastrConfig) {
		$ionicConfigProvider.tabs.position("bottom");
		$ionicConfigProvider.scrolling.jsScrolling(false);
		$ionicConfigProvider.views.transition('platform');
		$urlRouterProvider.otherwise('/home/post/nearby');
		angular.extend(toastrConfig, {
			autoDismiss: true,
			maxOpened: 1,
		});
		

	}

	app.run(['$rootScope', '$state', '$ionicPlatform', '$ionicLoading', 'RequestsService', '$cordovaPushV5', '$ionicHistory', function($rootScope, $state, $ionicPlatform, $ionicLoading, RequestsService, $cordovaPushV5, $ionicHistory) {

		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
				//window.pushNotification = window.plugins.pushNotification;
				//appStatus();
				notificationFunction();
				backButtonExit();
			}

			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}

			window.onerror = function(errorMsg, url, lineNumber) {
				return false;
			};
			
			$rootScope.$on("$stateChangeError", function() {
				$state.go('home.post.nearby');
				$ionicLoading.hide();
			});
		});

		function backButtonExit() {
			$ionicPlatform.registerBackButtonAction(function(e) {
				if ($rootScope.backButtonPressedOnceToExit) {
					ionic.Platform.exitApp();
				} else if ($ionicHistory.backView()) {
					$ionicHistory.goBack();
				} else {
					$rootScope.backButtonPressedOnceToExit = true;
					window.plugins.toast.showShortCenter(
						"Press back button again to exit",
						function(a) {},
						function(b) {}
					);
					window.setTimeout(function() {
						$rootScope.backButtonPressedOnceToExit = false;
					}, 2000);
				}
				e.preventDefault();
				return false;
			}, 101);
		}

		function notificationFunction() {
			RequestsService.register();

			$rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {
				console.log(data);
				console.log(event);
			});

			// triggered every time error occurs
			$rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e) {

			});
		}
	}]);

})(window.angular);
// red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green,,
//light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
// .config(function($mdThemingProvider) {
//   $mdThemingProvider.theme('default')
//     .primaryPalette('pink')
//     .accentPalette('orange');
// });//"angular-material": "master","ng-directive-lazy-image": "afkl-lazy-image#^0.3.1"

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
						templateUrl: 'app/message/views/messageRoomList.html',
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

(function(angular) {
	'use strict';
	angular.module('petal.home', [])
		.config(['$stateProvider', '$authProvider', config]);

	function config($stateProvider, $authProvider) {
		var fbClientId = '1134208830041632';
		var redirectUrl = "http://localhost:8100";
		var redirectUrl2 = "https://banana-surprise-31332.herokuapp.com";
		var authenticateUrl = redirectUrl2 + '/authenticate';
		$authProvider.facebook({
			clientId: fbClientId,
			url: authenticateUrl + '/auth/facebook',
			redirectUri: "https://banana-surprise-31332.herokuapp.com/"
		});
		$authProvider.google({
			clientId: '742676837265-33jntkd60p87gkrh48nqe6cdd8ntsfl5.apps.googleusercontent.com',
			url: authenticateUrl + '/auth/google',
			redirectUri: redirectUrl
		});
		$stateProvider.state('authenticate', {
			url: '/authenticate',
			controller: 'AuthenticationController',
			controllerAs: 'ac',
			templateUrl: 'app/home/views/authenticationPage.html',
			

		}).state('home', {
			url: "/home",
			abstract: true,
			templateUrl: "app/home/views/tabs.html",
			controller: 'HomeController',
			controllerAs: 'hc',
			resolve: {
				redirectIfUserNotAuthenticated: ['$q', '$auth', '$state', '$timeout', redirectIfUserNotAuthenticated]
			}
		});
	}



	function redirectIfUserNotAuthenticated($q, $auth, $state, $timeout) {
		var defer = $q.defer();

		if ($auth.isAuthenticated()) {

			defer.resolve();

		} else {
			$timeout(function() {
				$state.go('authenticate');
			});
			//defer.reject();
		}
		return defer.promise;
	}
	function redirectIfUserAuthenticated($q, $auth) {
		var defer = $q.defer();

		if ($auth.isAuthenticated()) {
			defer.reject();
			/*$timeout(function() {
				$state.go('authenticate');
			});*/
			

		} else {
			console.log("not audsnf");
			defer.resolve();
			//defer.reject();
		}
		return defer.promise;
	}

})(window.angular);

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
					messageRoom: [ '$stateParams', '$q', messageRoom]

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
			defer.resolve(response.data.foundMessageRoom);					
		}).catch(function(e){
			console.log("Resolve mesage Room");
			console.log(e);
			//defer.resolve();	
		});
		return defer.promise;
	}
})(window.angular);
(function(angular) {
	'use strict';
	angular.module('petal.people', [])
		.config(['$stateProvider', config]);


	function config($stateProvider) {
		$stateProvider
			.state('home.people',{
				url: '/people',
				abstract: true,
				views: {
					'people-tab': {
						templateUrl: 'app/people/views/peopleParent.html',
						controller: 'PeopleParentController',
						controllerAs: 'ppc'
					}
				}
				
			}).state('home.people.all',{
				url: '/all',
				
				views: {
					'people-tab': {
						templateUrl: 'app/people/views/allPeople.html',
						controller: 'AllPeopleController',
						controllerAs: 'apc'
					}
				}				
			}).state('home.people.revealed',{
				url: '/revealed',
				
				views: {
					'people-tab': {
						templateUrl: 'app/people/views/revealedPeople.html',
						controller: 'RevealedPeopleController',
						controllerAs: 'rpc'
					}
				}				
			}).state('home.people.received',{
				url: '/received',
				
				views: {
					'people-tab': {
						templateUrl: 'app/people/views/receivedPeople.html',
						controller: 'ReceivedPeopleController',
						controllerAs: 'rpc'
					}
				}				
			}).state('home.people.nearby',{
				url: '/nearby',
				views: {
					'people-tab': {
						templateUrl: 'app/people/views/nearbyPeople.html',
						controller: 'NearbyPeopleController',
						controllerAs: 'npc'
					}
				}				
			});
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.post', [])
		.config(['$stateProvider', config]);


	function config($stateProvider) {

		$stateProvider
			.state('home.post', {
				url: '/post',
				abstract: true,
				views: {
					'post-tab': {
						templateUrl: 'app/post/views/postParent.html',
						controller: 'PostParentController',
						controllerAs: 'ppc'
					}
				}

			}).state('home.post.all', {
				url: '/all',

				views: {
					'post-tab': {
						templateUrl: 'app/post/views/allPost.html',
						controller: 'AllPostController',
						controllerAs: 'apc'
					}
				}
			}).state('home.post.latest', {
				url: '/latest',

				views: {
					'post-tab': {
						templateUrl: 'app/post/views/latestPost.html',
						controller: 'LatestPostController',
						controllerAs: 'lpc'
					}
				}
			}).state('home.post.popular', {
				url: '/popular',

				views: {
					'post-tab': {
						templateUrl: 'app/post/views/popularPost.html',
						controller: 'PopularPostController',
						controllerAs: 'ppc'
					}
				}
			}).state('home.post.nearby', {
				url: '/nearby',

				views: {
					'post-tab': {
						templateUrl: 'app/post/views/nearbyPost.html',
						controller: 'NearbyPostController',
						controllerAs: 'npc'
					}
				}
			}).state('postSubmit', {
				url: '/submit',
				templateUrl: 'app/post/views/createPost.html',
				controller: 'CreatePostController',
				controllerAs: 'cpc'
				/*views: {
					'postSubmit-tab': {
						
					}
				}*/
			}).state('singlePost', {
				url: '/post/:id',
				templateUrl: 'app/post/views/singlePost.html',
						controller: 'SinglePostController',
						controllerAs: 'spc'
				/*views: {
					'singlePost-tab': {
						
					}
				}*/


			});
	}


})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.user', []).config(['$stateProvider',
		function($stateProvider) {
			$stateProvider.
			state('home.user', {
				url: '/user',
				'abstract': true,
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userParentPage.html',
						controller: 'UserParentController',
						controllerAs: 'upc'
					}
				}

			}).
			state('home.user.userMePage', {
				url: '/userMePage',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userMePage.html',
						controller: 'UserMePageController',
						controllerAs: 'umpc',
						
					}
				}

			}).
			state('home.userPage', {
				url: '/userPage/:user',
				resolve: {
					blocked: [ '$stateParams', 'blockService','$q', blocked],
					friends: [ '$stateParams', 'revealService','$q', friends]

				},
				views: {
					'extra-tab': {
						templateUrl: 'app/user/views/userProfilePage.html',
						controller: 'UserPageController',
						controllerAs: 'upc'
					}
				},
				

			})
			.state('home.userEditPage', {
				url: '/userEditPage',
				views: {
					'extra-tab': {
						templateUrl: 'app/user/views/userEditPage.html',
						controller: 'UserEditPageController',
						controllerAs: 'uepc',
						
					}
				}

			});
		}
	]);
	function blocked($stateParams,blockService,$q){
		var defer = $q.defer();
		blockService.check($stateParams.user).then(function(response){
			
			if(response.data.blocked===true){
				window.alert("Blocked profile");
				window.history.back();
			}
			else{
				defer.resolve();	
			}
			
			
		}).catch(function(){
			defer.resolve();	
		});
		return defer.promise;
	}
	function friends($stateParams,revealService,$q){
		var defer = $q.defer();


		revealService.check($stateParams.user).then(function(response){
			
			defer.resolve(response.data.status);
			//return ;
		}).catch(function(){
			
		});
		return defer.promise;
	}

	
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.chat')
		.controller('AllChatController', ['$scope', '$state', 'chatService', '$ionicLoading', 'Socket',AllChatController]);

	function AllChatController($scope, $state, chatService, $ionicLoading,Socket) {
		var acc = this;
		acc.getAllChatRooms = getAllChatRooms;
		acc.loadMoreChats = loadMoreChats;
		acc.pullRefreshChats = pullRefreshChats;
		activate();
		Socket.on('newMessageReceived', messageReceived);
		
		acc.chatPage = function(userId){
			$state.go('chatBox', { user: userId});
		};
		function messageReceived(message){
			var newChatRoom = {};
			newChatRoom.creator2 = message.user;
			newChatRoom.newChat = true;
			newChatRoom.lastMessage = {
				user:message.user._id,
				_id:message._id,
				message:message.message,
				type: message.type
			};
		

			for(var ch=0;ch<acc.chatRoomsList.length;ch++){
				if(newChatRoom.creator2._id==acc.chatRoomsList[ch].creator2._id){
					if (newChatRoom.lastMessage._id !== acc.chatRoomsList[ch].lastMessage._id) {
						acc.chatRoomsList.splice(ch,1);
						acc.chatRoomsList.unshift(newChatRoom);
						return;
					}
			}
			}
			
		}
		function pullRefreshChats() {
			activate();
		}

		function loadMoreChats() {
			acc.params.page += 1;
			getAllChatRooms();
		}

		function getAllChatRooms() {
			chatService.getAllChatRooms(acc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					acc.chatRoomsList.push(value);
				});
				acc.noPosts =!response.data.total;
				
				acc.initialSearchCompleted = true;
				if (response.data.total > acc.chatRoomsList.length) {
					acc.canLoadMoreResults = true;
				}
				else{
					acc.canLoadMoreResults = false;	
				}
			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});
		}

		function activate() {
			acc.canLoadMoreResults = false;
			acc.initialSearchCompleted = false;
			acc.params = {
				page: 1,
				limit: 25
			};
			acc.chatRoomsList = [];
			getAllChatRooms();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.chat')

	.controller('ChatBoxController', ['$scope', '$timeout', 'Socket', '$stateParams', 'userData', 'homeService', 'chatService', '$ionicScrollDelegate', 'userService', 'Upload', '$ionicLoading', '$window', 'blocked', ChatBoxController]);

	function ChatBoxController($scope, $timeout, Socket, $stateParams, userData, homeService, chatService, $ionicScrollDelegate, userService, Upload, $ionicLoading, $window, blocked) {
		var cbc = this;
		cbc.isBlocked = blocked;
		if (cbc.isBlocked === true) {
			window.alert("blocked profile");
		}
		cbc.currentUser = userData.getUser()._id;
		cbc.receiverUserID = $stateParams.user;
		cbc.chatList = [];
		cbc.chatRoomId = '';
		cbc.loadMoreChats = loadMoreChats;
		cbc.scrollBottom = scrollBottom;
		cbc.messageLoading = false;
		cbc.messageTryCount = 0;
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

				console.log(err);
			});
		}

		function scrollBottom() {
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

				console.log(res);
			}).finally(function() {
				scrollBottom();
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			$ionicLoading.show();
			chatService.getChatRoom(cbc.receiverUserID).then(function(res) {
				cbc.chatRoom = res.data;
				cbc.chatRoomId = res.data._id;

				socketJoin();
				getChatMessages();

			}, function(err) {
				console.log(err);
			});
			getReceiver();



		}


		function socketJoin() {
			Socket.emit('addToChatRoom', { 'roomId': cbc.chatRoomId });
			Socket.on('messageReceived', function(message) {

				cbc.chatList.push(message);
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
			scrollBottom();
			var chatObj = { 'message': cbc.myMsg, receiver: $stateParams.user, 'roomId': cbc.chatRoomId };
			chatService.sendChatMessage(chatObj).then(function(res) {
				cbc.myMsg = '';
				cbc.chatList.push(res.data.message);
				scrollBottom();
				cbc.messageTryCount = 0;
			}).catch(function(err) {
				//console.log(err);
				cbc.messageTryCount += 1;

				if (cbc.messageTryCount <= 3) {
					cbc.clickSubmit();
				}

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
				var chatObj = { 'message': cbc.uploadedImage, receiver: $stateParams.user, 'roomId': cbc.chatRoomId, type: 'img' };
				chatService.sendChatMessage(chatObj).then(function(res) {
					scrollBottom();
					cbc.chatList.push(res.data.message);
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
		cbc.leaveChatBox = function() {
			Socket.emit('removeFromRoom', { 'roomId': cbc.chatRoomId });

			chatService.updateChatRoom(cbc.chatRoomId).then(function(res) {

			}).catch(function(err) {
				//console.log(err);
			}).finally(function() {


			});

			$window.history.back();


		};

	}
})(window.angular);

/*userService.getUserDetails(cbc.receiverUserIDId, { 'fields': 'displayName firstName' }).then(function(response) {
					console.log("the receiver");
					console.log(response.data);
					cbc.receiverUserID = response.data.displayName || (response.data.firstName);
				});*/

(function(angular){
	'use strict';
	angular.module('petal.chat')
		.controller('ChatParentController',[ChatParentController]);

	function ChatParentController(){

	}
})(window.angular);
(function(angular) {
	'use strict';
	angular.module('petal.chat')
		.controller('RevealedChatController', ['$scope', '$state', 'chatService', '$ionicLoading', 'Socket', RevealedChatController]);

	function RevealedChatController($scope, $state, chatService, $ionicLoading, Socket) {
		var acc = this;
		acc.getRevealedChatRooms = getRevealedChatRooms;
		acc.loadMoreChats = loadMoreChats;
		acc.pullRefreshChats = pullRefreshChats;
		activate();

		function pullRefreshChats() {
			activate();
		}
		Socket.on('newMessageReceived', messageReceived);

		function messageReceived(message) {
			var newChatRoom = {};
			newChatRoom.creator2 = message.user;
			newChatRoom.newChat = true;
			newChatRoom.lastMessage = {
				user: message.user._id,
				_id: message._id,
				message: message.message,
				type: message.type
			};


			for (var ch = 0; ch < acc.chatRoomsList.length; ch++) {
				if (newChatRoom.creator2._id == acc.chatRoomsList[ch].creator2._id) {
					if (newChatRoom.lastMessage._id !== acc.chatRoomsList[ch].lastMessage._id) {
						acc.chatRoomsList.splice(ch, 1);
						acc.chatRoomsList.unshift(newChatRoom);
						return;
					}

				}
			}

		}

		function loadMoreChats() {
			acc.params.page += 1;
			getRevealedChatRooms();
		}

		function getRevealedChatRooms() {
			chatService.getRevealedChatRooms(acc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					acc.chatRoomsList.push(value);
				});
				acc.noPosts = !response.data.total;
				acc.initialSearchCompleted = true;
				if (response.data.total > acc.chatRoomsList.length) {
					acc.canLoadMoreResults = true;
				} else {
					acc.canLoadMoreResults = false;
				}
			}).finally(function() {

				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});
		}

		function activate() {
			acc.canLoadMoreResults = false;
			acc.initialSearchCompleted = false;
			acc.params = {
				page: 1,
				limit: 25
			};
			acc.chatRoomsList = [];
			getRevealedChatRooms();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.chat')
		.service('chatService', ['$http', '$stateParams', 'homeService', ReviewService]);

	function ReviewService($http, $stateParams, homeService) {
		var rs = this;
		rs.sendChatMessage = sendChatMessage;
		rs.getChatMessages = getChatMessages;
		rs.getChatRoom = getChatRoom;
		rs.getAllChatRooms = getAllChatRooms;
		rs.getRevealedChatRooms = getRevealedChatRooms;
		rs.updateChatRoom = updateChatRoom;
		rs.deleteChatRoom = deleteChatRoom;

		function deleteChatRoom(id){
			return $http.post(homeService.baseURL + 'chatRoom/delete/' + id);
		}
		function sendChatMessage(chat) {
			
			return $http.post(homeService.baseURL + 'chat/create/' + chat.roomId, chat);
		}

		function getChatMessages(chatRoomId,params) {
			
			return $http.get(homeService.baseURL + 'chat/getChats/' + chatRoomId,{params:params});
		}

		function getChatRoom(user) {
			
			return $http.get(homeService.baseURL + 'chatRoom/get/' + user);

		}
		function getAllChatRooms(params) {
			params.revealed = false;
			return $http.get(homeService.baseURL + 'chatRoom/all/',{params:params});

		}
		function getRevealedChatRooms(params) {
			params.revealed = true;
			return $http.get(homeService.baseURL + 'chatRoom/all/',{params:params});

		}
		function updateChatRoom(id){
			return $http.post(homeService.baseURL+'chatRoom/update/'+id);
		}

		


	}
})(window.angular);

(function(angular){
'use strict';
angular.module('petal.chat').factory('Socket', ['socketFactory','homeService',SocketFactory]);
    
    function SocketFactory(socketFactory,homeService) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect(homeService.baseURL)
        });
    }

})(window.angular);
(function(angular){
'use strict';



angular.module('petal.chat')
	.factory('SocketUserService', ['socketFactory','userData','homeService',socketFactoryFunction]);
    function socketFactoryFunction(socketFactory,userData,homeService) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect(homeService.baseURL+userData.getUser()._id)
        });
    }
})(window.angular);
(function(angular) {
	'use strict';

	angular.module('petal.home')
		.controller("AuthenticationController", ["$scope", "$auth", "$state", "userData", 'userLocationService', '$ionicLoading', 'RequestsService', '$ionicModal', AuthenticationController]);

	function AuthenticationController($scope, $auth, $state, userData, userLocationService, $ionicLoading, RequestsService, $ionicModal) {
		var phc = this;

		phc.isAuth = $auth.isAuthenticated();
		if (phc.isAuth) {
			$state.go('home.post.all');
		}
		if (window.cordova) {
			phc.webSignIn = true;
		}
		phc.authLogout = authLogout;
		phc.loadPostModal = loadPostModal;


		phc.socialAuthenticate = socialAuthenticate;
		$scope.googleSignIn = function() {



			$ionicLoading.show({
				template: 'Logging in...'
			});

			window.plugins.googleplus.login({
					webClientId: '792068565007-rdm7nrlfmc29jvlqo5l0tkgu6ci0vboa.apps.googleusercontent.com'

				},
				function(user_data) {
					var profile = {};
					profile.id = user_data.userId;
					profile.displayName = user_data.displayName;
					profile.imageUrl = user_data.imageUrl;
					RequestsService.googleSignIn(profile)
						.then(function(response) {
							$auth.setToken(response.data.token);
							successfulAuthentication(response.data.user);
						}).catch(function(err) {
							console.log("error");
							console.log(err);
							$ionicLoading.hide();
						});

				},
				function(msg) {
					alert("missed");
					console.log(msg);
					$ionicLoading.hide();
				}
			);
		};
		function successfulAuthentication(user) {
			userData.setUser(user);
			userLocationService.setUserLocation();
			RequestsService.register();

			if (user.device_token) {
				$state.go('home.post.popular');
			} else {
				$state.go('home.userEditPage');
			}
		}

		function socialAuthenticate(provider) {
			$ionicLoading.show();
			$auth.authenticate(provider).then(function(response) {
				successfulAuthentication(response.data.user);
			}).catch(function(err) {
				$ionicLoading.hide();

			}).finally(function() {
				//$ionicLoading.hide();
			});
		}


		function loadPostModal() {
			$ionicModal.fromTemplateUrl('app/home/views/policy.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}


		function authLogout() {
			$auth.logout();
			userData.removeUser();
			$state.go('authenticate');
		}
	}


})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.home')
		.controller('HomeController', ['$scope', '$state', 'userData', 'Socket', 'toastr', '$ionicTabsDelegate','$rootScope',HomeController]);

	function HomeController($scope, $state, userData, Socket, toastr,$ionicTabsDelegate,$rootScope) {
		var hc = this;
		hc.badgeValue = '';
		hc.chatClicked = chatClicked;
		/*
			Code for hiding the header on scroll up and down
		*/
		$rootScope.slideHeader = false;
  		$rootScope.slideHeaderPrevious = 0;
		Socket.on("connect", function() {
			Socket.emit('addToSingleRoom', { 'roomId': userData.getUser()._id });
			Socket.on('newMessageReceived', messageReceived);
		});

		function messageReceived(message) {
			var messageString = message.message;
			if(message.type && message.type=='img'){
				messageString = 'New image';
			}
			var userName = message.user.anonName||message.user.facebookName ||message.user.googleName ;
			if (message.user._id == userData.getUser()._id) {

			} else {
				if ($state.current.name == 'chatBox') {

					if ($state.params.user != message.user._id) {
						toastr.info('<p>' + userName+ '</p><p>' + messageString + '</p>', {
							allowHtml: true,
							onTap: function() {
								$state.go('chatBox', { user: message.user._id });
							}
						});
					}
				} else {
					
					toastr.info('<p>' + userName + '</p><p>' + messageString + '</p>', {
						allowHtml: true,
						onTap: function() {
							$state.go('chatBox', { user: message.user._id });
						}
					});
					hc.badgeValue = 1;

				}


			}
		}
		hc.goForward = function() {
			
			var selected = $ionicTabsDelegate.selectedIndex();
			if (selected != -1) {
				if(selected===1){
					$ionicTabsDelegate.select(selected + 2);	
				}
				else{
					$ionicTabsDelegate.select(selected + 1);	
				}
				
			}
		};

		hc.goBack = function() {

			var selected = $ionicTabsDelegate.selectedIndex();
			if (selected !== -1 && selected !== 0) {
				if(selected===3){
					$ionicTabsDelegate.select(selected - 2);
				}
				else{
					$ionicTabsDelegate.select(selected - 1);
				}
			}
		};

		function chatClicked() {
			hc.badgeValue = '';
			//$state.go('home.chat.all');
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.home')
		.directive('distanceView', ['postService', '$timeout', function(postService, $timeout) {
			return {
				restrict: 'E',
				templateUrl: 'app/home/views/distanceViewTemplate.html',
				scope: {
					positionCords: '='
				},
				replace: true,
				link: function(scope) {
					$timeout(getDistance, 1000);

					function getDistance() {
						if (scope.positionCords) {
							scope.distanceObj = {
								latitude: scope.positionCords[1],
								longitude: scope.positionCords[0],

							};
							postService.getDistance(scope.distanceObj).then(function(res) {
								scope.distanceObj.distance = res + ' mi';
							}).catch(function(err) {
								scope.distanceObj.distance = '';
							});
						} else {
							scope.distanceObj = {};
							scope.distanceObj.distance = '';
						}
					}


				}
			};
		}])
		.directive('ionicCustomSpinner',[ionicCustomSpinner]);

		function ionicCustomSpinner(){
			return {
				templateUrl: 'app/home/views/ionicCustomSpinner.html'
			};
		}
		/*.directive('expandingTextarea', [function() {
			return {
				restrict: 'A',
				controller: function($scope, $element, $attrs, $timeout) {
					$element.css('min-height', '0');
					$element.css('resize', 'none');
					$element.css('overflow-y', 'hidden');
					setHeight(0);
					$timeout(setHeightToScrollHeight);

					function setHeight(height) {
						$element.css('height', height + 'px');
						$element.css('max-height', height + 'px');
					}

					function setHeightToScrollHeight() {
						setHeight(0);
						var scrollHeight = angular.element($element)[0]
							.scrollHeight;
						if (scrollHeight !== undefined) {
							setHeight(scrollHeight);
						}
					}

					$scope.$watch(function() {
						return angular.element($element)[0].value;
					}, setHeightToScrollHeight);
				}
			};
		}])*/
})(window.angular);

(function(angular) {
	'use strict';
	var imageModal = function($ionicModal) {
		return {
			restrict: 'A',
			scope: {

				imageModal: '@'
			},
			link: function($scope, elem) {

				function showImageModal(image) {
					loadModal().then(function() {
						$scope.currentImage = image;
						$scope.modal.show();
					});

				}

				function loadModal() {
					return $ionicModal.fromTemplateUrl('app/chat/views/chatImageModal.html', {
						scope: $scope
					}).then(function(modal) {
						$scope.modal = modal;
					});
				}
				elem.bind('click', function(event) {
					showImageModal($scope.imageModal);
					event.stopPropagation();
				});
			}
		};

	};
	angular.module('petal.home').directive('keepScroll', [
		'$state', '$timeout', 'ScrollPositions', '$ionicScrollDelegate',
		function($state, $timeout, ScrollPositions, $ionicScrollDelegate) {
			return {
				restrict: 'A',
				link: function(scope) {
					scope.$on('$stateChangeStart', function() {
						ScrollPositions[$state.current.name] = $ionicScrollDelegate.getScrollPosition();

					});
					$timeout(function() {
						var offset;
						offset = ScrollPositions[$state.current.name];
						if (offset) {
							$ionicScrollDelegate.scrollTo(offset.left, offset.top);
						}
					});
				}
			};
		}
	]).factory('ScrollPositions', [
		function() {
			return {};
		}
	]).directive('isFocused', ['$timeout', function($timeout) {
		return {
			scope: { trigger: '@isFocused' },
			link: function(scope, element) {

				scope.$watch('trigger', function(value) {

					if (value === 'true') {
						$timeout(function() {
							element[0].focus();

							element.on('blur', function() {
								//alert("hello");
								element[0].focus();
							});
						});
					}

				});
			}
		};
	}]).directive('lazyImg', function() {
		return {
			/*     <lazy-img src-large="http://youbaku.com/uploads/places_images/large/{{img}}" src-small="http://youbaku.com/athumb.php?file={{img}}&small" />
			 */
			replace: true,
			template: '<div class="lazy-img"><div class="sm"><img src="{{imgSmall}}" class="small"/></div><div style="padding-bottom: 75%;"></div><img src="{{imgLarge}}" class="large"/></div>',
			scope: {
				imgLarge: '@srcLarge',
				imgSmall: '@srcSmall'
			},

			link: function(scope, elem) {
				var imgSmall = new Image();
				var imgLarge = new Image();
				imgSmall.src = scope.imgSmall;
				imgSmall.onload = function() {
					elem.children('.sm').find('img').css('opacity', '1');
					imgLarge.src = scope.imgLarge;
					imgLarge.onload = function() {
						elem.find('img').css('opacity', '1');
					};
				};
			}
		};
	}).directive('imageModal', ['$ionicModal', imageModal])
	.directive('watchScroll',['$rootScope',watchScroll]);

	function watchScroll($rootScope){
		return {
			restrict: 'A',
			link: function(scope,elem){

				var start = 0;
				var threshold = 150;
				elem.bind('scroll',function(e){
					
					var scrollTop = e.srcElement.scrollTop;
					if(scrollTop-start > threshold){
						$rootScope.slideHeader = true;
					}else{
						$rootScope.slideHeader = false;
					}
					if($rootScope.slideHeaderPrevious > scrollTop - start){
						$rootScope.slideHeader = false;
					}
					$rootScope.slideHeaderPrevious = scrollTop - start;
					$rootScope.$apply();
				});
			}
		};
	}


})(window.angular);

(function(angular){
	'use strict';
	angular.module('petal.home')
		.service('homeService',['$http','Upload',HomeService]);

		function HomeService($http,Upload){
			this.baseURL = 'https://petalchat-imanjithreddy.c9users.io/';
			//this.baseURL = 'https://banana-surprise-31332.herokuapp.com/';
			this.deleteUpload = deleteUpload;
			this.submitUpload = submitUpload;
			this.getImages = getImages;
			var that = this;
			function deleteUpload(id){
				return $http.post(that.baseURL+'upload/deleteUpload', {'data' : {'public_id':id}} );
			}
			function getImages(imageText){
				console.log(imageText);
				return $http.get(that.baseURL+'upload/getImages',{params:{imageText:imageText}});
			}
			function submitUpload(file){
				return Upload.upload({
					url: that.baseURL + 'upload/singleUploadId',
					data: { file: file }
				});
			}
		}
})(window.angular);
(function(angular) {
	'use strict';
	
		angular.module('petal.home')
			.service('RequestsService', ['homeService', '$http', '$q', '$ionicLoading', '$cordovaPushV5', '$auth', RequestsService]);
	

	function RequestsService(homeService, $http, $q, $ionicLoading, $cordovaPushV5, $auth) {

		var base_url = homeService.baseURL;

		function register() {

			var deferred = $q.defer();
			
			var options = {
				android: {
					senderID: "679461840115",
					vibrate: "true"
				},
				browser:{

				},
				ios: {
					alert: "true",
					badge: "true",
					sound: "true"
				},
				windows: {}
			};
			/*if(vibrate){
				//options.android.vibrate = true;
				//options.android.forceShow =true;
			}*/
			
			$cordovaPushV5.initialize(options).then(function() {
				// start listening for new notifications
				$cordovaPushV5.onNotification(function(){
					console.log("insideeee notification");
					console.log(arguments);
				});
				// start listening for errors
				$cordovaPushV5.onError();

				// register to get registrationId
				if ($auth.isAuthenticated()) {
					$cordovaPushV5.register().then(function(registrationId) {
						$http.post(base_url + 'notification/register', { 'device_token': registrationId })
							.then(function(response) {
								deferred.resolve(response);
							})
							.catch(function(data) {
								deferred.reject(data);
							}).finally(function() {
								$ionicLoading.hide();
							});
					});
				}

			});


			return deferred.promise;

		}
		function googleSignIn(profile){
			return $http.post(base_url+'authenticate/auth/nativeGoogle', { profile: profile });
		}
		return {
			googleSignIn: googleSignIn,
			register: register
		};
	}

})(window.angular);

(function(angular){
'use strict';

/**
 * @ngdoc service
 * @name authModApp.userData
 * @description
 * # userData
 * Factory in the authModApp.
 */
angular.module('petal.home')
  .factory('userData',['$window','$state','$auth','$http','homeService',userData]);

  function userData($window,$state,$auth,$http,homeService) {
    var storage = $window.localStorage;
    var cachedUser={};
    var obj1 =  {
      setUser: function (user) {
        
        if(user){
          storage.setItem('user',JSON.stringify(user));
        }
        else{

          var userId = $auth.getPayload().sub;
          if(userId){
            return $http.get(homeService.baseURL+'user/get/'+userId).then(function(res){
              
              /*if(obj1.isUserExists()){
                  storage.removeItem('user');
              }*/
            
              storage.setItem('user',JSON.stringify(res.data));
            });
          }
        }
        

      },
      getUser: function(){

        return JSON.parse(storage.getItem('user'));
      },
      removeUser: function(){
        cachedUser = null;
        storage.removeItem('user');
      },
      isUserExists: function(){
        if(obj1.getUser()){
          return true;
        }
        return false;
      }
    };
    return obj1;
  }
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.message')

	.controller('MessageRoomController', ['$scope', '$timeout', 'Socket', '$stateParams', 'userData', 'homeService', 'messageRoomService', '$ionicScrollDelegate', 'userService', 'Upload', '$ionicLoading', '$window', 'blocked', MessageRoomController]);

	function MessageRoomController($scope, $timeout, Socket, $stateParams, userData, homeService, messageRoomService, $ionicScrollDelegate, userService, Upload, $ionicLoading, $window, blocked) {
		var cbc = this;
		cbc.isBlocked = blocked;
		cbc.currentUser = userData.getUser()._id;
		
		cbc.messageList = [];
		cbc.messageRoomId = '';
		cbc.loadMoreMessages = loadMoreMessages;
		cbc.scrollBottom = scrollBottom;
		cbc.messageLoading = false;
		
		cbc.params = {
			page: 1,
			limit: 5
		};
		activate();

		function loadMoreMessages() {
			cbc.params.page += 1;
			getMessages();
		}

		function getReceiver() {
			userService.getUser(cbc.receiverUserID).then(function(response) {
				cbc.receiverUser = response.data;
			}).catch(function(err) {

				console.log(err);
			});
		}

		function scrollBottom() {
			$timeout(function() {
				$ionicScrollDelegate.scrollBottom(true);
			});

		}

		function getMessages() {
			messageRoomService.getMessages(cbc.messageRoomId, cbc.params).then(function(res) {

				angular.forEach(res.data.docs, function(message) {
					cbc.messageList.unshift(message);
				});
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
			messageRoomService.getMessageRoom(cbc.receiverUserID).then(function(res) {
				cbc.messageRoom = res.data;
				cbc.messageRoomId = res.data._id;

				socketJoin();
				getMessages();

			}, function(err) {
				console.log(err);
			});
			getReceiver();



		}


		function socketJoin() {
			Socket.emit('addToMessagetRoom', { 'roomId': cbc.messageRoomId });
			Socket.on('roomMessageReceived', function(message) {

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
			scrollBottom();
			var messageObj = { 'message': cbc.myMsg, receiver: $stateParams.user, 'roomId': cbc.messageRoomId };
			messageRoomService.sendMessage(messageObj).then(function(res) {
				cbc.myMsg = '';
				cbc.messageList.push(res.data.message);
				scrollBottom();
				cbc.messageTryCount = 0;
			}).catch(function(err) {
				//console.log(err);
				cbc.messageTryCount += 1;

				if (cbc.messageTryCount <= 3) {
					cbc.clickSubmit();
				}

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
				var messageObj = { 'message': cbc.uploadedImage, receiver: $stateParams.user, 'roomId': cbc.messageRoomId, type: 'img' };
				messageRoomService.sendMessage(messageObj).then(function(res) {
					scrollBottom();
					cbc.messageList.push(res.data.message);
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
			Socket.emit('removeFromMessageRoom', { 'roomId': cbc.messageRoomId });

			$window.history.back();


		};

	}
})(window.angular);

/*userService.getUserDetails(cbc.receiverUserIDId, { 'fields': 'displayName firstName' }).then(function(response) {
					console.log("the receiver");
					console.log(response.data);
					cbc.receiverUserID = response.data.displayName || (response.data.firstName);
				});*/

(function(angular) {
	'use strict';
	angular.module('petal.message')
		.controller('MessageRoomListController', ['$scope', '$state', 'messageRoomService', '$ionicLoading', 'Socket',MessageRoomListController]);

	function MessageRoomListController($scope, $state, messageRoomService, $ionicLoading,Socket) {
		var acc = this;
		acc.getAllMessageRooms = getAllMessageRooms;
		acc.loadMoreMessages = loadMoreMessages;
		acc.pullRefreshMessages = pullRefreshMessages;
		activate();
		Socket.on('newRoomMessageReceived', messageReceived);
		
		acc.messageRoomPage = function(messageRoom){
			if(messageRoom.interest){
				$state.go('messageRoomInterest', { interest: messageRoom.interest});	
			}else{
				$state.go('messageRoomPost', { postId: messageRoom.post});	
			}
			
		};
		function messageReceived(message){
			var newMessageRoom = {};
			newMessageRoom.newMessage = true;
			newMessageRoom.lastMessage = {
				_id:message._id,
				message:message.message,
				type: message.type
			};
		

			for(var ch=0;ch<acc.messageRoomsList.length;ch++){
				if(newMessageRoom.creator2._id==acc.messageRoomsList[ch].creator2._id){
					if (newMessageRoom.lastMessage._id !== acc.messageRoomsList[ch].lastMessage._id) {
						acc.messageRoomsList.splice(ch,1);
						acc.messageRoomsList.unshift(newMessageRoom);
						return;
					}
			}
			}
			
		}
		function pullRefreshMessages() {
			activate();
		}

		function loadMoreMessages() {
			acc.params.page += 1;
			getAllMessageRooms();
		}

		function getAllMessageRooms() {
			messageRoomService.getMessageRooms().then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					acc.messageRoomsList.push(value);
				});
				acc.noPosts =!response.data.total;
				
				acc.initialSearchCompleted = true;
				if (response.data.total > acc.messageRoomsList.length) {
					acc.canLoadMoreResults = true;
				}
				else{
					acc.canLoadMoreResults = false;	
				}
			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});
		}

		function activate() {
			acc.canLoadMoreResults = false;
			acc.initialSearchCompleted = false;
			acc.params = {
				page: 1,
				limit: 25
			};
			acc.messageRoomsList = [];
			getAllMessageRooms();
		}
	}
})(window.angular);

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

		function getMessageRoom(params) {
			
			return $http.get(homeService.baseURL + 'messageRoom/getRoom/',{params:params} );

		}
		function getMessageRooms() {
			
			return $http.get(homeService.baseURL + 'messageRoom/getRooms/' );

		}
		
		


	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('AllPeopleController', ['$scope', '$state', 'peopleService','$ionicLoading', AllPeopleController]);

	function AllPeopleController($scope, $state, peopleService,$ionicLoading) {
		var apc = this;
		apc.getAllPeople = getAllPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;
		apc.searchCrossSubmit = searchCrossSubmit;
		apc.peopleSearchTextSubmit = peopleSearchTextSubmit;

		activate();

		function pullRefreshPeople() {
			activate();

		}
		function searchCrossSubmit(){
			apc.peopleSearchText = '';
			apc.showSearchCross = false;
			activate();
		}
		function peopleSearchTextSubmit(interest){
			apc.showSearchCross = true;
			if(interest){
				apc.peopleSearchText = interest;	
			}
			
			activate();
		}
		function loadMorePeople() {
			apc.params.page += 1;
			getAllPeople();
		}

		function getAllPeople() {
			peopleService.getAllUsers(apc.params).then(function(response) {
				
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.peopleList = [];
			apc.params = {
				limit: 25,
				page: 1
			};
			if(apc.peopleSearchText){
				apc.params.interest = 	apc.peopleSearchText;
			}
			getAllPeople();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('NearbyPeopleController', ['$scope', '$state', 'peopleService','$ionicLoading', NearbyPeopleController]);

	function NearbyPeopleController($scope, $state, peopleService,$ionicLoading) {
		var apc = this;
		apc.getNearbyPeople = getNearbyPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;
		apc.releaseRange = releaseRange;
		apc.distance = 10;
		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getNearbyPeople();
		}
		function releaseRange(){
			activate();
		}
		function getNearbyPeople() {
			peopleService.getNearbyUsers(apc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.noPeople =!response.data.total;
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}).catch(function(err) {
				console.log(err);
			}).finally(function() {
				apc.initialSearchCompleted = true;
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.peopleList = [];
			apc.params = {
				limit: 25,
				page: 1,
				distance: apc.distance
			};
			getNearbyPeople();
		}
	}
})(window.angular);

(function(angular){
	'use strict';
	angular.module('petal.people')
		.controller('PeopleParentController',[PeopleParentController]);

	function PeopleParentController(){

	}
})(window.angular);
(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('ReceivedPeopleController', ['$scope', '$state', 'peopleService','$ionicLoading', ReceivedPeopleController]);

	function ReceivedPeopleController($scope, $state, peopleService,$ionicLoading) {
		var apc = this;
		apc.getReceivedPeople = getReceivedPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;


		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getReceivedPeople();
		}

		function getReceivedPeople() {
			peopleService.getReceivedUsers(apc.params).then(function(response) {
				
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.noPeople =!response.data.total;
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.peopleList = [];
			apc.params = {
				limit: 10,
				page: 1
			};
			getReceivedPeople();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('RequestedPeopleController', ['$scope', '$state', 'peopleService','$ionicLoading', RequestedPeopleController]);

	function RequestedPeopleController($scope, $state, peopleService,$ionicLoading) {
		var apc = this;
		apc.getRequestedPeople = getRequestedPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;


		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getRequestedPeople();
		}

		function getRequestedPeople() {
			peopleService.getRequestedUsers(apc.params).then(function(response) {
				
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.peopleList = [];
			apc.params = {
				limit: 25,
				page: 1
			};
			getRequestedPeople();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('RevealedPeopleController', ['$scope', '$state', 'peopleService','$ionicLoading', RevealedPeopleController]);

	function RevealedPeopleController($scope, $state, peopleService,$ionicLoading) {
		var apc = this;
		apc.getRevealedPeople = getRevealedPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;


		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getRevealedPeople();
		}

		function getRevealedPeople() {
			peopleService.getRevealedUsers(apc.params).then(function(response) {
				
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.noPeople =!response.data.total;
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});

		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.peopleList = [];
			apc.params = {
				limit: 25,
				page: 1
			};
			getRevealedPeople();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.directive('peopleList', [ 'userData',peopleList]);


	function peopleList( userData) {
		return {
			restrict: 'E',
			templateUrl: 'app/people/views/peopleListTemplate.html',
			replace: true,
			scope: {
				listType: '@listType',
				peopleList: '=peopleList',
				peopleSearchTextSubmit: '&peopleSearchTextSubmit'
			},
			controller: ['$scope', function($scope) {
				$scope.currentUser = userData.getUser();
				$scope.setPeopleSearch = function(interest,$event){
					if($scope.peopleSearchTextSubmit){
						
						$scope.peopleSearchTextSubmit({interest:interest});	
						$event.stopPropagation();
					}
					
				};
				$scope.removeAfterDecided = function(index){
					$scope.peopleList.splice(index,1);
				};
				
			}]
		};
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.directive('receivedPeopleList', [ 'peopleService', '$ionicLoading', receivedPeopleList]);


	function receivedPeopleList( peopleService, $ionicLoading) {
		return {
			restrict: 'E',
			templateUrl: 'app/people/views/receivedPeopleList.html',
			replace: true,
			controllerAs: 'rpc',
			scope: {

			},
			controller: ['$scope', function($scope) {
				var rpc = this;
				rpc.getReceivedPeople = getReceivedPeople;
				rpc.loadMorePeople = loadMorePeople;
				activate();
				
				function getReceivedPeople() {
					peopleService.getReceivedUsers(rpc.params).then(function(response) {

						angular.forEach(response.data.docs, function(value) {
							rpc.peopleList.push(value);
						});
						rpc.noPeople = !response.data.total;
						rpc.initialSearchCompleted = true;
						if (response.data.total > rpc.peopleList.length) {
							rpc.canLoadMoreResults = true;
						} else {
							rpc.canLoadMoreResults = false;
						}
					}).catch(function(err) {
						console.log(err);

					}).finally(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$ionicLoading.hide();
					});

				}

				function loadMorePeople() {
					rpc.params.page += 1;
					getReceivedPeople();
				}

				function activate() {
					rpc.canLoadMoreResults = false;
					rpc.initialSearchCompleted = false;
					rpc.peopleList = [];
					rpc.params = {
						limit: 10,
						page: 1
					};
					getReceivedPeople();
				}


			}]
		};
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.directive('requestedPeopleList', [ 'peopleService', '$ionicLoading', requestedPeopleList]);


	function requestedPeopleList( peopleService, $ionicLoading) {
		return {
			restrict: 'E',
			templateUrl: 'app/people/views/requestedPeopleList.html',
			replace: true,
			controllerAs: 'rpc',
			scope: {

			},
			controller: ['$scope', function($scope) {
				var rpc = this;
				rpc.getRequestedPeople = getRequestedPeople;
				rpc.loadMorePeople = loadMorePeople;
				activate();
				
				function getRequestedPeople() {
					peopleService.getRequestedUsers(rpc.params).then(function(response) {

						angular.forEach(response.data.docs, function(value) {
							rpc.peopleList.push(value);
						});
						rpc.noPeople = !response.data.total;
						rpc.initialSearchCompleted = true;
						if (response.data.total > rpc.peopleList.length) {
							rpc.canLoadMoreResults = true;
						} else {
							rpc.canLoadMoreResults = false;
						}
					}).catch(function(err) {
						console.log(err);

					}).finally(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$ionicLoading.hide();
					});

				}

				function loadMorePeople() {
					rpc.params.page += 1;
					getRequestedPeople();
				}

				function activate() {
					rpc.canLoadMoreResults = false;
					rpc.initialSearchCompleted = false;
					rpc.peopleList = [];
					rpc.params = {
						limit: 10,
						page: 1
					};
					getRequestedPeople();
				}


			}]
		};
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.directive('cancelReveal', ['$ionicActionSheet', 'revealService', cancelReveal])
		.directive('decideReveal', ['$ionicActionSheet', 'revealService', decideReveal])
		.directive('deleteReveal', ['$ionicActionSheet', 'revealService', deleteReveal])
		.directive('sendReveal', ['$ionicActionSheet', 'revealService', sendReveal])
		.directive('createBlock', ['$ionicActionSheet', 'blockService', createBlock])
		.directive('deleteBlock', ['$ionicActionSheet', 'blockService', deleteBlock])
		.directive('deleteChat', ['$ionicActionSheet', 'chatService','$state', deleteChat])
		.directive('chatPage', ['$state', chatPage])
		.directive('userSettings', ['$ionicPopover', userSettings])
		.directive('userPage', ['$state', userPage]);

	
	function deleteChat($ionicActionSheet, chatService,$state) {
		return {
			restrict: 'A',
			scope: {
				deleteChat: '@',
				afterCallback: '&'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$ionicActionSheet.show({
						titleText: 'Delete ',
						buttons: [{
							text: '<i class="icon ion-share"></i> Delete Chat '
						}, ],

						cancelText: 'Cancel',
						cancel: function() {
							console.log('CANCELLED');
						},
						buttonClicked: function(index) {
							if (index === 0) {
								chatService.deleteChatRoom(scope.deleteChat).then(function(res) {
									if (scope.afterCallback) {
										scope.afterCallback();
									}
									window.alert(res.data);
									$state.go('home.chat.all');
								}).catch(function(err) {
									window.alert(JSON.stringify(err));
								});

							}
							return true;

						}
					});
					event.stopPropagation();
				});
			}
		};

	}

	function userSettings($ionicPopover) {
		return {
			scope: {
				userBlock: '@',
				chatDelete: '@',
				blockId: '@'
			},
			link: function(scope, elem) {
				scope.userBlock = (scope.userBlock==="true");
				scope.afterCallback = function(){
					scope.popover.remove();
					window.history.back();
				};
				elem.bind('click', function(event) {
					$ionicPopover.fromTemplateUrl('app/user/views/settingsTemplate.html', {
						scope: scope
					}).then(function(popover) {
						scope.popover = popover;
						scope.popover.show(event);
					});
					event.stopPropagation();
				});
			}
		};
	}

	function chatPage($state) {
		return {
			scope: {
				chatPage: '@'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$state.go('chatBox', { user: scope.chatPage });
					event.stopPropagation();
				});
			}
		};
	}

	function userPage($state) {
		return {
			scope: {
				userPage: '@'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$state.go('home.userPage', { user: scope.userPage });
					event.stopPropagation();
				});
			}
		};
	}

	function cancelReveal($ionicActionSheet, revealService) {
		return {
			restrict: 'A',
			scope: {
				afterCallback: '&',
				cancelReveal: '@'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$ionicActionSheet.show({
						titleText: 'Reveal',
						buttons: [{
							text: '<i class="icon ion-share"></i> Cancel Reveal Request'
						}, ],
						cancelText: 'Cancel',
						cancel: function() {

						},
						buttonClicked: function(index) {
							revealService.cancel(scope.cancelReveal).then(function(res) {

								if (scope.afterCallback) {
									scope.afterCallback();
								}

							}).catch(function(err) {
								window.alert(JSON.stringify(err));
							});
							return true;
						}
					});
					event.stopPropagation();
				});
			}
		};

	}

	function decideReveal($ionicActionSheet, revealService) {
		return {
			restrict: 'A',
			scope: {
				afterCallback: '&',
				decideReveal: '@'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$ionicActionSheet.show({
						titleText: 'Reveal',
						buttons: [{
							text: '<i class="icon ion-share"></i> Accept Reveal Request'
						}, {
							text: '<i class="icon ion-share"></i> Deny Reveal Request'
						}, ],

						cancelText: 'Cancel',
						cancel: function() {
							console.log('CANCELLED');
						},
						buttonClicked: function(index) {

							if (index === 0) {
								revealService.accept(scope.decideReveal).then(function(res) {
									if (scope.afterCallback) {
										scope.afterCallback();
									}
								}).catch(function(err) {
									window.alert(JSON.stringify(err));
								});

							} else if (index === 1) {
								revealService.ignore(scope.decideReveal).then(function(res) {

									if (scope.afterCallback) {
										scope.afterCallback();
									}
								}).catch(function(err) {
									window.alert(JSON.stringify(err));
								});

							}
							return true;

						}
					});
					event.stopPropagation();
				});

			}
		};

	}

	function deleteReveal($ionicActionSheet, revealService) {
		return {
			restrict: 'A',
			scope: {
				afterCallback: '&',
				deleteReveal: '@'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$ionicActionSheet.show({
						titleText: 'Reveal',
						buttons: [{
							text: '<i class="icon ion-share"></i> Delete Reveal '
						}, ],

						cancelText: 'Cancel',
						cancel: function() {
							console.log('CANCELLED');
						},
						buttonClicked: function(index) {
							if (index === 0) {
								revealService.finish(scope.deleteReveal).then(function(res) {
									if (scope.afterCallback) {
										scope.afterCallback();
									}
								}).catch(function(err) {
									window.alert(JSON.stringify(err));
								});

							}
							return true;

						}
					});
					event.stopPropagation();
				});
			}
		};

	}

	function sendReveal($ionicActionSheet, revealService) {
		return {
			restrict: 'A',
			scope: {
				afterCallback: '&',
				sendReveal: '@'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$ionicActionSheet.show({
						titleText: 'Reveal',
						buttons: [{
							text: '<i class="icon ion-share"></i> Send Reveal Request'
						}, ],

						cancelText: 'Cancel',
						cancel: function() {},
						buttonClicked: function(index) {
							revealService.initiate(scope.sendReveal).then(function(res) {

								if (scope.afterCallback) {
									scope.afterCallback();
								}
							}).catch(function(err) {
								window.alert(JSON.stringify(err));
							});
							return true;
						}

					});
					event.stopPropagation();
				});

			}
		};

	}

	function createBlock($ionicActionSheet, blockService) {
		return {
			restrict: 'A',
			scope: {
				createBlock: '@',
				afterCallback: '&'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$ionicActionSheet.show({
						titleText: 'Block User',
						buttons: [{
							text: '<i class="icon ion-share"></i> Block'
						}, ],

						cancelText: 'Cancel',
						cancel: function() {},
						buttonClicked: function(index) {
							blockService.create(scope.createBlock).then(function(res) {

								window.alert("user blocked");
								if(scope.afterCallback){
									scope.afterCallback();
								}
							}).catch(function(err) {
								window.alert(JSON.stringify(err));
							});
							return true;
						}

					});
					event.stopPropagation();
				});

			}
		};

	}

	function deleteBlock($ionicActionSheet, blockService) {
		return {
			restrict: 'A',
			scope: {
				afterCallback: '&',
				deleteBlock: '@'
			},
			link: function(scope, elem) {
				elem.bind('click', function(event) {
					$ionicActionSheet.show({
						titleText: 'Block',
						buttons: [{
							text: '<i class="icon ion-share"></i> Unblock User '
						}, ],

						cancelText: 'Cancel',
						cancel: function() {
							console.log('CANCELLED');
						},
						buttonClicked: function(index) {
							if (index === 0) {
								blockService.remove(scope.deleteBlock).then(function(res) {
									if (scope.afterCallback) {
										scope.afterCallback();
									}
								}).catch(function(err) {
									window.alert(JSON.stringify(err));
								});

							}
							return true;

						}
					});
					event.stopPropagation();
				});
			}
		};

	}
})(window.angular);

(function(angular) {
	'use strict';
	/*
	 *Service for getting a single store with its id
	 */
	angular.module('petal.people')
		.service('peopleService', ["$http", "homeService", 'userLocationService', '$q', PeopleService]);

	/*
	 * This servic has a function names getStore which takes id as parameter and returns a promise
	 */
	function PeopleService($http, homeService, userLocationService, $q) {

		this.getAllUsers = getAllUsers;
		this.getRevealedUsers = getRevealedUsers;
		this.getNearbyUsers = getNearbyUsers;
		this.getRequestedUsers = getRequestedUsers;
		this.getReceivedUsers = getReceivedUsers;
		this.getNearbyUsers = getNearbyUsers;

		function getAllUsers(params) {
			params.all = true;
			return $http.get(homeService.baseURL + "user/getUsers", { params: params });

		}

		function getRevealedUsers(params) {
			params.revealed = true;
			return $http.get(homeService.baseURL + "user/getUsers", { params: params });

		}

		function getReceivedUsers(params) {
			params.received = true;
			return $http.get(homeService.baseURL + "user/getUsers", { params: params });

		}

		function getRequestedUsers(params) {
			params.requested = true;
			return $http.get(homeService.baseURL + "user/getUsers", { params: params });

		}
		function getFilteredUsers(defer,params){
			$http.get(homeService.baseURL + "user/getUsers", { params: params }).then(function(users) {
					defer.resolve(users);
				}).catch(function(err) {
					defer.reject(err);
				});
		}
		function getNearbyUsers(params) {
			if (params.page == 1) {
				userLocationService.setUserLocation();
			}
			params.nearby = true;
			var defer = $q.defer();
			
			userLocationService.getUserLocation().then(function(position) {
				params.latitude = position.latitude;
				params.longitude = position.longitude;
				$http.get(homeService.baseURL + "user/getUsers", { params: params }).then(function(users) {
					defer.resolve(users);
				}).catch(function(err) {
					defer.reject(err);
				});
			}).catch(function(err) {
				window.console.log(err);
				getFilteredUsers(defer,params);
			});

			return defer.promise;
		}





	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.post').
	service('upvoteService', ['$http', 'homeService',  UpvoteService]);


	function UpvoteService($http, homeService) {
		
		this.createUpvote = createUpvote;
		this.deleteUpvote = deleteUpvote;
		this.getUpvote = getUpvote;


		function getUpvote(postId) {
			return $http.get(homeService.baseURL + 'upvote/get/'+postId);
		}
		
		function createUpvote(postId) {
			return $http.post(homeService.baseURL + 'upvote/create/'+postId);
		}

		function deleteUpvote(postId) {
			return $http.post(homeService.baseURL + 'upvote/delete/' + postId);
		}

		

	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('AllPostController', ['$scope', '$state', 'postService','$ionicLoading', AllPostController]);

	function AllPostController($scope, $state, postService,$ionicLoading) {
		var apc = this;
		apc.getAllPosts = getAllPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		apc.postSearchTextSubmit = postSearchTextSubmit;
		apc.searchCrossSubmit = searchCrossSubmit;
		apc.params = {
				limit: 3,
				page: 1
			};
		activate();
		
		function pullRefreshPosts() {
			activate();

		}
		function searchCrossSubmit(){
			apc.postSearchText = '';
			apc.showSearchCross = false;
			activate();
		}
		function postSearchTextSubmit(interest){
			
			apc.showSearchCross = true;
			if(interest){
				apc.postSearchText = interest;	
			}
			if(apc.postSearchText){
				activate();	
			}
			
		}
		function loadMorePosts() {
			apc.params.page += 1;
			getAllPosts();
		}

		function getAllPosts() {
			apc.noPosts = false;	
			postService.getAllPosts(apc.params).then(function(response) {
				
				angular.forEach(response.data.docs, function(value) {
					apc.postsList.push(value);
				});
				apc.noPosts =!response.data.total;
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.postsList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
			}).catch(function(err) {
				

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});


		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.postsList = [];
			apc.params = {
				limit: 5,
				page: 1,

			};
			if(apc.postSearchText){
				apc.params.interest = 	apc.postSearchText;
			}
			getAllPosts();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('CreatePostController', ['$scope', '$state', 'postService','$ionicLoading', 'homeService',CreatePostController]);

	function CreatePostController($scope, $state, postService,$ionicLoading,homeService) {
		var cpc = this;
		cpc.submitPost = submitPost;
		cpc.post = {};
		$ionicLoading.hide();
		cpc.goBack = function(){
			window.history.back();
		};
		$scope.$watch(function(){
			return cpc.post.content;
		}, function(newVal, oldVal) {
			if (newVal && newVal.length > 300) {
				cpc.post.content = oldVal;
			}
		});

		function submitPost() {
			$ionicLoading.show();
			postService.submitPost(cpc.post).then(function(response) {
				$ionicLoading.hide();
				$state.go('home.post.latest');
			}).catch(function(err) {
				console.log("post controller error");
				console.log(err);
			}).finally(function(){
				$ionicLoading.hide();
			});
		}
		cpc.selectRandomImage = function(img){
			cpc.post.image = img;
		};
		cpc.loadRandomImages = function(imageText){
			cpc.loadingRandomImage = true;
			cpc.randomImages = [];
			homeService.getImages(imageText).then(function(response){
				cpc.randomImages = response.data;
				cpc.loadingRandomImage = false;
			}).catch(function(err){
				console.log("images err");
				console.log(err);
			});
		};
		cpc.cancelUpload = function() {
			if(cpc.post.imageId){
				homeService.deleteUpload(cpc.post.imageId).then(function(response){
					cpc.post.image = '';
					cpc.post.imageId = '';					
				});
			}

			
		};

		cpc.submitUpload = function(file, errFiles) {
			if(cpc.post.imageId){
				cpc.cancelUpload();
			}
			cpc.loadingImage = true;
			cpc.file = file;
			cpc.errFile = errFiles && errFiles[0];
			if (cpc.file) {
				homeService.submitUpload(cpc.file).then(function(response) {
					cpc.post.image = response.data.image;
					cpc.post.imageId = response.data.imageId;
					cpc.loadingImage = false;
				});
			}

		};
		
	}
})(window.angular);

(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('LatestPostController',['$scope','$state','postService','$ionicLoading',LatestPostController]);

	function LatestPostController($scope,$state,postService,$ionicLoading){
		var apc = this;
		apc.getLatestPosts = getLatestPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		activate();

		function pullRefreshPosts() {
			activate();

		}

		function loadMorePosts() {
			apc.params.page += 1;
			getLatestPosts();
		}

		function getLatestPosts() {
			postService.getLatestPosts(apc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					apc.postsList.push(value);
				});
				apc.noPosts =!response.data.total;
				
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.postsList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
			}).catch(function(err) {
				console.log(err);
			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});


		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.postsList = [];
			apc.params = {
				limit: 3,
				page: 1
			};
			getLatestPosts();
		}
	}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('NearbyPostController',['$scope','$state','postService','$ionicLoading',NearbyPostController]);

	function NearbyPostController($scope,$state,postService,$ionicLoading){
		var apc = this;
		apc.getNearbyPosts = getNearbyPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		apc.releaseRange = releaseRange;
		apc.distance = 10;
		activate();

		function pullRefreshPosts() {
			activate();

		}
		function releaseRange(){
			activate();
		}
		function loadMorePosts() {
			apc.params.page += 1;
			getNearbyPosts();
		}

		function getNearbyPosts() {
			postService.getNearbyPosts(apc.params).then(function(response) {
				
				angular.forEach(response.data.docs, function(value) {
					apc.postsList.push(value);
				});
				apc.noPosts =!response.data.total;
				
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.postsList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
				
			}).catch(function(err) {
				console.log(err);
				

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
				apc.initialSearchCompleted = true;
			});


		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.postsList = [];
			apc.params = {
				limit: 10,
				page: 1,
				distance: apc.distance
			};
			getNearbyPosts();
		}
	}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('PopularPostController',['$scope','$state','postService','$ionicLoading',PopularPostController]);

	function PopularPostController($scope,$state,postService,$ionicLoading){
		var apc = this;
		apc.getPopularPosts = getPopularPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		activate();

		function pullRefreshPosts() {
			activate();

		}

		function loadMorePosts() {
			apc.params.page += 1;
			getPopularPosts();
		}

		function getPopularPosts() {
			postService.getPopularPosts(apc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					apc.postsList.push(value);
				});
				if(!response.data.total){
					apc.noPosts = true;
				}
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.postsList.length) {
					apc.canLoadMoreResults = true;
				}
				else{
					apc.canLoadMoreResults = false;	
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$ionicLoading.hide();
			});


		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.postsList = [];
			apc.params = {
				limit: 3,
				page: 1
			};
			getPopularPosts();
		}
	}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('PostParentController',['$rootScope',PostParentController]);

	function PostParentController($rootScope){
		//$rootScope.slideHeader = true;
	}
})(window.angular);
(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('SinglePostController', ['$scope', '$state', 'postService', '$stateParams','$ionicHistory','upvoteService',SinglePostController]);

	function SinglePostController($scope, $state, postService,$stateParams,$ionicHistory,upvoteService) {
		var apc = this;
		apc.getSinglePost= getSinglePost;
		apc.submitPostUpvote = submitPostUpvote;
		apc.deletePostUpvote = deletePostUpvote;
		apc.getPostDistance = getPostDistance;
		apc.back = function(){
			
			window.history.back(); 
		};
		
		activate();
		
		function getSinglePost() {
			postService.getPost($stateParams.id).then(function(response) {
				apc.post = response.data;
				apc.distanceObj = {
					latitude:apc.post.loc[1],
					longitude: apc.post.loc[0],
					diatance: 0
				};
				getPostDistance();
				
				
			});

		}
		function checkPostUpvote(){
			upvoteService.getUpvote(apc.currentPost).then(function(res){
				
				apc.postUpvoted = res.data || false;
			}).catch(function(err){
				console.log(err);
			});
		}
		function submitPostUpvote(){
			upvoteService.createUpvote(apc.currentPost).then(function(res){
				checkPostUpvote();
			}).catch(function(err){
				console.log(err);
			});
		}
		function deletePostUpvote(){
			upvoteService.deleteUpvote(apc.currentPost).then(function(res){
				checkPostUpvote();
			}).catch(function(err){
				console.log(err);
			});
		}
		function activate(){
			apc.currentPost = $stateParams.id;
			getSinglePost();
			checkPostUpvote();
			
		}
		function getPostDistance(){
			postService.getDistance(apc.distanceObj);
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	var postModule = angular.module('petal.post');
	postModule.directive('postSearchModal', ['$ionicModal', 'postService',postSearchModal]);

	function postSearchModal($ionicModal, postService) {
		return {
			restrict: 'A',
			scope: {
				postSearchModal: '@'
			},
			link: function(scope, elem) {
				
				scope.postSearchData = {};
				scope.postSearchData.postSearchModal = scope.postSearchModal;
				scope.postSearchData.postsList = [];
				scope.modalsList = [];
				scope.clickPostSearch = clickPostSearch;
				scope.showPostModal = function() {
					loadPostModal().then(function() {
						scope.modal.show();
						
					});
					scope.$on('modal.hidden', function() {

						scope.modal.remove();
					});
				};
				scope.getPosts = function(params) {
					
					postService.getAllPosts(params).then(function(response) {
						
						angular.forEach(response.data.docs, function(value) {
							scope.postSearchData.postsList.push(value);
						});
						scope.postSearchData.noPosts = !response.data.total;
						scope.postSearchData.initialSearchCompleted = true;
						if (response.data.total > scope.postSearchData.postsList.length) {
							scope.postSearchData.canLoadMoreResults = true;
						} else {
							scope.postSearchData.canLoadMoreResults = false;
						}
					});
				};
				function clickPostSearch(){
					scope.postSearchData.postsList = [];
					var params = {
						interest: scope.postSearchData.postSearchModal ,
						page: 1,
						limit: 50
					};
					scope.getPosts(params);
				}
				function loadPostModal() {
					return $ionicModal.fromTemplateUrl('app/post/views/postSearchModal.html', {
						scope: scope
					}).then(function(modal) {
						scope.modal = modal;
						
					});
				}
				elem.bind('click', function(event) {
					var params = {
						interest: scope.postSearchData.postSearchModal ,
						page: 1,
						limit: 50
					};
					scope.showPostModal();
					event.stopPropagation();
					scope.getPosts(params);
				});
			}
		};

	}

})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.post')
		.directive('postsList', ['$state', 'userData', 'postService', 'upvoteService', '$ionicModal',postsList]);


	function postsList( $state, userData, postService, upvoteService,$ionicModal) {
		return {
			restrict: 'E',
			templateUrl: 'app/post/views/postsListTemplate.html',
			scope: {
				postsList: '=postsList',
				postSearchTextSubmit: '&postSearchTextSubmit'
			},
			replace: true,
			//controller: ['scope', ]
			link: function (scope) {
				
				scope.getTime = function(time){
					return moment(time).fromNow();
				};
				scope.currentUser = userData.getUser();

				scope.setPostSearch = function(interest){
					if(scope.postSearchTextSubmit){
						scope.postSearchTextSubmit({interest:interest});	
					}
					
				};
				scope.userPage = userPage;
				function userPage(id){
					scope.modal.hide();
					$state.go('home.userPage', { user: id });
				}
				function loadPostModal() {
					return $ionicModal.fromTemplateUrl('app/post/views/postModal.html', {
						scope: scope
					}).then(function(modal) {
						scope.modal = modal;
					});
				}
				scope.postModal = {};
				scope.postModal.userPage = userPage;
				

				scope.showPostModal = function(post) {
					scope.postModal.post = post;
					scope.postModal.post.views+=1;
					loadPostModal().then(function(){

						scope.modal.show();	
					});
					scope.$on('modal.hidden', function() {
    						
    						scope.modal.remove();
  					});
					
				};

				
			}
		};
	}

	
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.post')
		.directive('postUpvote', ['$state', 'upvoteService','$timeout',postUpvote]);


	function postUpvote( $state, upvoteService,$timeout) {
		return {
			restrict: 'E',
			templateUrl: 'app/post/views/postUpvoteTemplate.html',
			scope: {
				postId: '=postId',
				upvotesLength: '=upvotesLength'
			},
			replace: true,
			link: function (scope) {
				scope.checkPostUpvote = checkPostUpvote;
				scope.submitPostUpvote = submitPostUpvote;
				scope.deletePostUpvote = deletePostUpvote;
				activate();
				function activate() {

					scope.loadingUpvote = true;
					checkPostUpvote();					
				}


				function checkPostUpvote() {
					upvoteService.getUpvote(scope.postId).then(function(res) {
						
						scope.postUpvoted = res.data;
						scope.loadingUpvote = false;	
					}).catch(function(err) {
						console.log("check error");
						console.log(err);
					});
				}

				function submitPostUpvote() {
					scope.postUpvoted = true;
					
					upvoteService.createUpvote(scope.postId).then(function() {
						
						scope.upvotesLength+=1;	
						
					}).catch(function(err) {
						console.log("submit error");
						console.log(err);
					});
				}

				function deletePostUpvote() {
					scope.postUpvoted = false;
					upvoteService.deleteUpvote(scope.postId).then(function() {
						
						scope.upvotesLength-=1;	
						
					}).catch(function(err) {
						
						window.alert(err);
					});
				}

				

			}
		};
	}

	
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.post').
	service('postService', ['$http', 'homeService', 'userLocationService', '$q', PostService]);


	function PostService($http, homeService, userLocationService, $q) {
		this.getAllPosts = getAllPosts;
		this.getNearbyPosts = getNearbyPosts;
		this.getLatestPosts = getLatestPosts;
		this.getPopularPosts = getPopularPosts;
		this.submitPost = submitPost;
		this.deletePost = deletePost;
		this.getPost = getPost;
		this.getDistance = getDistance;

		function getAllPosts(params) {
			
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}
		function getFilteredPosts(defer,params){
			$http.get(homeService.baseURL + "post/getPosts", { params: params }).then(function(posts) {
					console.log("without position");
					defer.resolve(posts);
				}).catch(function(err2) {
					defer.reject(err2);
				});
		}
		function getNearbyPosts(params) {
			params.nearby = true;
			var defer = $q.defer();
			
			if(params.page==1){
				userLocationService.setUserLocation();
      			}
      			
			userLocationService.getUserLocation().then(function(position) {
				params.latitude = position.latitude;
				params.longitude = position.longitude;
				$http.get(homeService.baseURL + "post/getPosts", { params: params }).then(function(posts) {
					defer.resolve(posts);
				}).catch(function(err) {
					defer.reject(err);
				});
			}).catch(function(err) {
				window.console.log(err);
				getFilteredPosts(defer,params);
			});

			return defer.promise;

		}

		function getLatestPosts(params) {
			params.sort = '-time';
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}

		function getPopularPosts(params) {
			params.sort = '-upvotesLength';
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}

		function submitPost(post) {
			var defer = $q.defer();
			console.log("entered submit post");
			userLocationService.getUserLocation().then(function(position) {
				post.latitude = position.latitude;
				post.longitude = position.longitude;

				$http.post(homeService.baseURL + 'post/create', { post: post }).then(function(response) {

					defer.resolve(response);
				}).catch(function(err) {
					defer.reject(err);
				});
			}).catch(function(err) {
				$http.post(homeService.baseURL + 'post/create', { post: post }).then(function(response) {
				
					defer.resolve(response);
				}).catch(function(err2) {
					defer.reject(err2);
				});
			});
			return defer.promise;
		}

		function deletePost(postId) {
			return $http.delete(homeService.baseURL + 'post/delete/' + postId);
		}

		function getPost(postId) {
			return $http.get(homeService.baseURL + 'post/get/' + postId);
		}

		function getDistance(posObj) {
			var defer = $q.defer();
			var lat1 = posObj.latitude;
			var lon1 = posObj.longitude;
			userLocationService.getUserLocation().then(function(position) {
				var lat2 = position.latitude;
				var lon2 = position.longitude;
				var R = 6371; // Radius of the earth in km
				var dLat = deg2rad(lat2 - lat1); // deg2rad below
				var dLon = deg2rad(lon2 - lon1);
				var a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
					Math.sin(dLon / 2) * Math.sin(dLon / 2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				var d = R * c; // Distance in km
			
				defer.resolve(Math.ceil(d));
			}).catch(function(err) {
				console.log(err);
			});
			return defer.promise;

		}

		function deg2rad(deg) {
			return deg * (Math.PI / 180);
		}

	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserEditPageController', ['$scope', '$state', 'homeService', 'userData', 'userService', 'Upload', '$ionicLoading', UserEditPageController]);

	function UserEditPageController($scope, $state, homeService, userData, userService, Upload, $ionicLoading) {

		var umpc = this;

		umpc.activate = activate;

		activate();

		function getUser() {
			umpc.user = userData.getUser();
			$scope.editForm.user = umpc.user;
			if (umpc.user.interests.length) {
				$scope.editForm.user.interests = '!' + umpc.user.interests.join('!');
			}
		}

		function activate() {
			$ionicLoading.hide();
			$scope.editForm = {};
			getUser();
			
		}

		$scope.editForm.submitUser = function() {
			$ionicLoading.show();
			
			userService.updateUser($scope.editForm.user).then(function(res) {
				window.alert("updated user");
				$state.go('home.user.userMePage');
			}).catch(function(err){
				
			}).finally(function(){
				userData.setUser();
				$ionicLoading.hide();
			});
		};
		$scope.editForm.uploadUserPicture = function(file, errFiles) {
			$scope.loadingImage = true;
			umpc.file = file;
			umpc.errFile = errFiles && errFiles[0];
			if (file) {
				umpc.file.upload = Upload.upload({
					url: homeService.baseURL + 'upload/singleUpload',
					data: { file: umpc.file }
				});

				umpc.file.upload.then(function(response) {
					umpc.file.result = response.data;
					$scope.editForm.user.picture = response.data;
					$scope.loadingImage = false;



				});
			}

		};
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserMePageController', ['$scope', '$state', '$auth','userData', 'peopleService','postService','$window', '$ionicLoading',UserMePageController]);

	function UserMePageController($scope, $state, $auth,userData, peopleService,postService,$window,$ionicLoading) {

		var umpc = this;
		umpc.logout = logout;
		umpc.activate = activate;
		
		umpc.activeTab = 1;
		umpc.activateTab = activateTab;
		umpc.isTabActive = isTabActive;

		umpc.subActiveTab = 1;
		umpc.subActivateTab = subActivateTab;
		umpc.isSubTabActive = isSubTabActive;



		umpc.openFacebook = openFacebook;
		activate();
		function openFacebook(id){
			$window.open('https://www.facebook.com/'+id, '_system');
		}
		function getUser() {
			userData.setUser().then(function() {
				umpc.user = userData.getUser();

			}).catch(function(err){
				window.console.log(err);
			}).finally(function(){
				$ionicLoading.hide();
			});

		}
		function getUserPosts(){
			umpc.params = {
				page: 1,
				limit: 100,
				user: userData.getUser()._id
			};
			postService.getLatestPosts(umpc.params).then(function(res){
				umpc.postsList = res.data.docs;
			});
		}
		function activateTab(tabIndex){
			umpc.activeTab = tabIndex;
		}
		function isTabActive(tabIndex){
			return tabIndex === umpc.activeTab;
		}
		function subActivateTab(subTabIndex){
			umpc.subActiveTab = subTabIndex;
		}
		function isSubTabActive(subTabIndex){
			return subTabIndex === umpc.subActiveTab;
		}

		function logout() {
			$auth.logout();
			$state.go('authenticate');
		}

		function activate() {
			getUser();
			getRequestedList();
			$scope.$broadcast('scroll.refreshComplete');
			getUserPosts();
		}

		function getRequestedList() {
			peopleService.getRequestedUsers({ page: 1, limit: 25 }).then(function(response) {
				umpc.peopleList = response.data.docs;
				umpc.total = response.data.total;
			});
		}
		function getReceivedList() {
			peopleService.getReceivedUsers({ page: 1, limit: 25 }).then(function(response) {
				umpc.peopleList = response.data.docs;
				umpc.total = response.data.total;
			});
		}
		function getRevealedList() {
			peopleService.getRevealedUsers({ page: 1, limit: 25 }).then(function(response) {
				umpc.peopleList = response.data.docs;
				umpc.total = response.data.total;
			});
		}
		
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserPageController', ['$state', '$auth', 'userService', 'revealService','$stateParams', 'friends','postService','$window','$ionicLoading',UserPageController]);

	function UserPageController($state, $auth, userService, revealService,$stateParams,friends,postService,$window,$ionicLoading) {

		var upc = this;
		upc.checkReveal = checkReveal;
		upc.goBack = goBack;
		upc.activateTab = activateTab;
		upc.isTabActive = isTabActive;
		upc.openFacebook = openFacebook;
		upc.openGoogle = openGoogle;
		activate();
		
		function openFacebook(id){
			$window.open('https://www.facebook.com/'+id, '_system');
		}
		function openGoogle(id){
			$window.open('https://plus.google.com/'+id, '_system');
		}
		function activate() {
			getUser();
			upc.revealChoice = friends;
			upc.activeTab = 1;
			getUserPosts();
		}
		function getUserPosts(){
			upc.params = {
				page: 1,
				limit: 100,
				user: $stateParams.user
			};
			postService.getLatestPosts(upc.params).then(function(res){
				upc.postsList = res.data.docs;
			});
		}
		function activateTab(tabIndex){
			upc.activeTab = tabIndex;
		}
		function isTabActive(tabIndex){
			return tabIndex === upc.activeTab;
		}
		
		function checkReveal(){
			revealService.check($stateParams.user).then(function(res){
				upc.revealChoice = res.data.status;
			});
		}
		function goBack(){
			$window.history.back();
		}
		function getUser() {

			userService.getUser($stateParams.user).then(function(response) {
				upc.user = response.data;
				

			}).catch(function(err){
				
				
			}).finally(function(){
				$ionicLoading.hide();
			});
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserPagePostsController', ['$state',  '$stateParams', 'friends',UserPagePostsController]);

	function UserPagePostsController($state,  $stateParams,friends) {
		alert(friends);


		
	}
})(window.angular);

(function(angular){
	'use strict';
	angular.module('petal.user').
		controller('UserParentController',[UserParentController]);

		function UserParentController(){
			
		}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.user')
		.directive('blockedList',['blockService',blockedList]);

	function blockedList(blockService){
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/user/views/blockedList.html',
			link: function(scope){
				scope.afterCallback = function(index){
					scope.peopleList.splice(index,1);
				};
				blockService.getBlocks().then(function(response){
					window.console.log(response);
					scope.peopleList = response.data;
				});
			}
		};
	}
})(window.angular);
(function(angular) {
	'use strict';
	angular.module('petal.user').
	service('blockService', ['$http', 'homeService',BlockService]);


	function BlockService($http, homeService) {
		this.create = create;
		this.remove = remove;
		this.getBlocks = getBlocks;
		this.check = check;
		
		function create(id) {
			return $http.post(homeService.baseURL + 'block/create', { secondUser: id });
		}
		function remove(id) {	
			return $http.post(homeService.baseURL + 'block/delete', { secondUser: id });
		}
		function check(id) {
			return $http.get(homeService.baseURL + 'block/get/'+id);
		}
		function getBlocks() {
			return $http.get(homeService.baseURL + 'block/getBlocks/');
		}
	}
})(window.angular);
(function(angular) {
	'use strict';
	angular.module('petal.user').
	service('revealService', ['$http', 'homeService',RevealService]);


	function RevealService($http, homeService) {
		this.initiate = initiate;
		this.accept = accept;
		this.ignore = ignore;
		this.cancel = cancel;
		this.received = received;
		this.requested = requested;
		this.revealed = revealed;
		this.finish = finish;
		this.check = check;

		function getParams(id){
			return {
				'secondUser': id
			};
		}
		function initiate(id) {
			return $http.post(homeService.baseURL + 'reveal/initiate', { secondUser: id });
		}

		function accept(id) {
			
			return $http.post(homeService.baseURL + 'reveal/accept', { secondUser: id });
		}

		function ignore(id) {
			
			return $http.post(homeService.baseURL + 'reveal/ignore', { secondUser: id });
		}

		function cancel(id) {
			
			return $http.post(homeService.baseURL + 'reveal/cancel', { secondUser: id });
		}

		function received(id) {
			var params = getParams(id);
			return $http.get(homeService.baseURL + 'reveal/received', {params:params});
				
		}

		function requested(id) {
			var params = getParams(id);
			return $http.get(homeService.baseURL + 'reveal/requested', {params:params});
		}

		function revealed(id) {
			var params = getParams(id);
			return $http.get(homeService.baseURL + 'reveal/revealed', {params:params});
		}
		function finish(id) {
			return $http.post(homeService.baseURL + 'reveal/finish', {secondUser: id});
		}
		function check(id){
			var params = getParams(id);
			return $http.get(homeService.baseURL + 'reveal/check', {params:params});	
		}

	}
})(window.angular);
(function(angular) {
	'use strict';

	angular.module('petal.user')
		.service('userLocationService', ['$cordovaGeolocation', 'userService', '$q', '$http', 'toastr', UserLocationService]);


	function UserLocationService($cordovaGeolocation, userService, $q, $http, toastr) {
		this.getUserLocation = getUserLocation;
		this.setUserLocation = setUserLocation;

		function getUserLocation() {
			
			var deferred = $q.defer();
			var options = { timeout: 3000, enableHighAccuracy: false };

			$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
				var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
				deferred.resolve(positions);
			}).catch(function() {
				$http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA5bqvCp1wYX7FGKiDyd3w0DzvJZoPwQrQ').then(function(response) {
					var coords = {
						latitude: response.data.location.lat,
						longitude: response.data.location.lng
					};
					deferred.resolve(coords);
				}).catch(function(err) {
					window.console.log("error from google");
					window.console.log(err);
					deferred.reject('Not able to acces your location.Make sure location is enabled.');
				});

			});
			return deferred.promise;
		}

		function setUserLocation() {
			var options = { timeout: 3000, enableHighAccuracy: false };
			$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
				var positions = { latitude: position.coords.latitude, longitude: position.coords.longitude };
				userService.updateUser(positions);
			}).catch(function(err) {
				$http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA5bqvCp1wYX7FGKiDyd3w0DzvJZoPwQrQ').then(function(response) {
					var coords = {
						latitude: response.data.location.lat,
						longitude: response.data.location.lng
					};
					userService.updateUser(coords);
					
				}).catch(function() {
					if (err.code == 3) {
							toastr.warning('Not able to acces your location.Make sure location is enabled.', 'Warning', {

								maxOpened: 1,
							});

						} else if (err.code == 2 || err.code == 1) {
							toastr.warning('Not able to acces your location.Make sure location is enabled.', 'Warning', {

								maxOpened: 1,
							});
						}
				});
				
			});
		}




	}
})(window.angular);

(function(angular) {
  'use strict';
  /*
   *Service for getting a single store with its id
   */
  angular.module('petal.user')
    .service('userService', ["$http", "homeService", UserService]);

  /*
   * This servic has a function names getStore which takes id as parameter and returns a promise
   */
  function UserService($http, homeService) {
    this.updateUser = updateUser;
    
    this.getUser = getUser;
    


    function getUser(id) {
      return $http.get(homeService.baseURL + "user/get/" + id);

    }

    function updateUser(user) {
      return $http.post(homeService.baseURL + 'user/update/', { user: user });
    }
    


  }
})(window.angular);
