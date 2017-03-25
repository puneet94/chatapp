(function(angular) {

	'use strict';

	var app = angular.module('petal', ['ui.router', 'ionic', 'satellizer', 'ngFileUpload', 'btford.socket-io',
		'ngCordova', 'petal.home', 'petal.post', 'petal.chat', 'petal.user', 'petal.people',
	]);
	app.config(['$urlRouterProvider', '$stateProvider', '$ionicConfigProvider',
		function($urlRouterProvider, $stateProvider, $ionicConfigProvider) {
			$ionicConfigProvider.tabs.position("bottom");
			$urlRouterProvider.otherwise('/home/post/all');
		}
	]);
	app.run(['$rootScope', '$state', '$ionicPlatform', function($rootScope, $state, $ionicPlatform) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});

		/*$rootScope.$on('$stateChangeError', function() {

			//hide loading gif

			console.log('you are not authorized to view this page');
			
			$state.go('authenticate');


		});*/
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
			}).state('chatBox', {
				url: '/chatBox/:user',
				templateUrl: 'app/chat/views/chatBox.html',
				controller: 'ChatBoxController',
				controllerAs: 'cbc'

			});
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.home', [])
		.config(['$stateProvider', '$authProvider', config]);

	function config($stateProvider, $authProvider) {
		var fbClientId = '1134208830041632';
		var redirectUrl = "http://localhost:8100";
		var redirectUrl2 = "https://petalchat-imanjithreddy.c9users.io";
		var authenticateUrl = redirectUrl2 + '/authenticate';
		$authProvider.facebook({
			clientId: fbClientId,
			url: authenticateUrl + '/auth/facebook',
			redirectUri: "https://petalchat-imanjithreddy.c9users.io/"
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
			console.log("not audsnf");
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
			}).state('home.postSubmit', {
				url: '/submit',

				views: {
					'postSubmit-tab': {
						templateUrl: 'app/post/views/createPost.html',
						controller: 'CreatePostController',
						controllerAs: 'cpc'
					}
				}
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
			state('home.user.userPage', {
				url: '/userPage/:user',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userProfilePage.html',
						controller: 'UserPageController',
						controllerAs: 'upc'
					}
				}

			}).
			/*state('tabs.userProfileSettings', {
				url: '/userProfileSettings',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userProfileSettingsPage.html',
					}
				}

			}).
			state('tabs.userAccountSettings', {
				url: '/userAccountSettings',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userAccountSettingsPage.html',
					}
				}

			}).*/
			state('home.user.userMePage', {
				url: '/userMePage',
				views: {
					'user-tab': {
						templateUrl: 'app/user/views/userMePage.html',
						controller: 'UserMePageController',
						controllerAs: 'umpc',
						
					}
				}

			});
		}
	]);



	function redirectIfNotUserAuthenticated($q, $auth, changeBrowserURL) {
		var defer = $q.defer();

		if ($auth.isAuthenticated()) {
			defer.resolve();

		} else {
			defer.reject();
			changeBrowserURL.changeBrowserURLMethod('/home');
		}
		return defer.promise;
	}

})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.chat')
		.controller('AllChatController', ['$scope', '$state', 'chatService', AllChatController]);

	function AllChatController($scope, $state,chatService) {
		var acc = this;
		acc.params = {
			page: 1,
			limit: 25
		};
		acc.chatRoomsList = [];
		acc.getAllChatRooms = getAllChatRooms;
		acc.loadMoreChats = loadMoreChats;
		acc.pullRefreshChats = pullRefreshChats;
		activate();

		function pullRefreshChats() {
			acc.params.page = 1;
			acc.chatRoomsList = [];
			getAllChatRooms();

		}

		function loadMoreChats() {
			acc.params.page += 1;
			getAllChatRooms();
		}

		function getAllChatRooms() {
			chatService.getAllChatRooms(acc.params).then(function(response){
				console.log("all chats");

				angular.forEach(response.data.docs, function(value) {
					acc.chatRoomsList.push(value);
				});
				console.log(acc.chatRoomsList);
			});
		}

		function activate() {
			getAllChatRooms();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.chat')

	.controller('ChatBoxController', ['$scope', 'Socket', '$stateParams', 'userData', 'homeService','chatService' ,'$ionicScrollDelegate','userService','Upload',ChatBoxController]);

	function ChatBoxController($scope, Socket, $stateParams, userData, homeService,chatService,$ionicScrollDelegate,userService,Upload) {
		var cbc = this;

		cbc.currentUser = userData.getUser()._id;
		cbc.receiverUserID = $stateParams.user;
		cbc.chatList = [];
		cbc.chatRoomId = '';
		cbc.loadMoreChats = loadMoreChats;
		cbc.messageLoading = false;
		cbc.params = {
			page: 1,
			limit: 5
		};
		activate();
		function loadMoreChats(){
			cbc.params.page+=1;
			getChatMessages();
		}
		function getReceiver(){
			userService.getUser(cbc.receiverUserID).then(function(response){
				cbc.receiverUser = response.data;
			}).catch(function(err){
				window.alert(err);
				console.log(err);
			});
		}
		function getChatMessages() {
			chatService.getChatMessages(cbc.chatRoomId,cbc.params).then(function(res) {
				
				angular.forEach(res.data.docs, function(chat) {
					cbc.chatList.unshift(chat);
				});
			}).catch(function(res) {
				window.alert(res);
				console.log(res);
			}).finally(function(){
				$ionicScrollDelegate.scrollBottom(true);
				$scope.$broadcast('scroll.refreshComplete');
			});

		}
		function activate() {
			chatService.getChatRoom(cbc.receiverUserID).then(function(res) {
				console.log(res);
				cbc.chatRoomId = res.data._id;
				socketJoin();
				getChatMessages();
			}, function(res) {
				console.log('the error in getting chatroom');
				console.log(res);
			});
			getReceiver();
		}


		function socketJoin() {
			console.log("socket joined");
			Socket.emit('addToChatRoom', { 'roomId': cbc.chatRoomId });
			Socket.on('messageReceived', function(message) {
				
				cbc.chatList.push(message);
				$ionicScrollDelegate.scrollBottom(true);
				//$('.chatBoxUL').animate({ scrollTop: 99999999 }, 'slow');
			});
			Socket.on('messageSaved', function(message) {
				
				cbc.chatList.push(message);
				$ionicScrollDelegate.scrollBottom(true);
				//$('.chatBoxUL').animate({ scrollTop: 99999999 }, 'slow');
			});
		}

		cbc.clickSubmit = function() {

			cbc.messageLoading = true;
			var chatObj = { 'message': cbc.myMsg,receiver:$stateParams.user, 'roomId': cbc.chatRoomId };
			chatService.sendChatMessage(chatObj).then(function(res) {
				cbc.myMsg = ' ';
				cbc.messageLoading = false;
				console.log($('#chatInput'));
				$('#chatInput').focus();
			}).catch( function(err) {

				console.log(err);
			});


		};


		cbc.submitUpload = function(){
			cbc.file.upload = Upload.upload({
					url: homeService.baseURL + 'upload/singleUpload',
					data: { file: cbc.file }
				});

				cbc.file.upload.then(function(response) {
					cbc.file.result = response.data;
					cbc.uploadedImage = response.data;
					console.log("the banner image");
					console.log(cbc.uploadedImage);
					cbc.cancelUpload();



					var chatObj = { 'message': cbc.uploadedImage,receiver:$stateParams.user, 'roomId': cbc.chatRoomId ,type:'img'};
			chatService.sendChatMessage(chatObj).then(function(res) {
				console.log(res);
				$('#chatInput').focus();
			}).catch( function(err) {

				console.log(err);
			});

				});
		};
		cbc.cancelUpload = function(){
			cbc.showTempImage = false;
			cbc.tempImageUrl = '';
		};
		cbc.uploadSingleImage = function(file, errFiles) {
			cbc.file = file;
			cbc.errFile = errFiles && errFiles[0];
			if (file) {
				cbc.showTempImage = true;
				cbc.tempImageUrl = file;
				cbc.formBannerLoading = true;
				/*
				file.upload = Upload.upload({
					url: homeService.baseURL + 'upload/singleUpload',
					data: { file: file }
				});

				file.upload.then(function(response) {
					file.result = response.data;
					cbc.uploadedImage = response.data;
					console.log("the banner image");
					console.log(cbc.uploadedImage);
					cbc.formBannerLoading = false;

				});*/
			}
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
		.controller('ChatParentController',['$scope','$state',ChatParentController]);

	function ChatParentController($scope,$state){

	}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.chat')
		.controller('RevealedChatController',['$scope','$state','chatService',RevealedChatController]);

	function RevealedChatController($scope,$state,chatService){
		var acc = this;
		acc.params = {
			page: 1,
			limit: 25
		};
		acc.chatRoomsList = [];
		acc.getRevealedChatRooms = getRevealedChatRooms;
		acc.loadMoreChats = loadMoreChats;
		acc.pullRefreshChats = pullRefreshChats;
		activate();

		function pullRefreshChats() {
			acc.params.page = 1;
			acc.chatRoomsList = [];
			getRevealedChatRooms();

		}

		function loadMoreChats() {
			acc.params.page += 1;
			getRevealedChatRooms();
		}

		function getRevealedChatRooms() {
			chatService.getRevealedChatRooms(acc.params).then(function(response){
				angular.forEach(response.data.docs, function(value) {
					acc.chatRoomsList.push(value);
				});
			});
		}

		function activate() {
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

		function sendChatMessage(chat) {
			console.log("chat messgae");
			console.log(chat);
			return $http.post(homeService.baseURL + 'chat/create/' + chat.roomId, chat);
		}

		function getChatMessages(chatRoomId,params) {
			console.log("params");
			console.log(params);
			return $http.get(homeService.baseURL + 'chat/getChats/' + chatRoomId,{params:params});
		}

		function getChatRoom(user) {
			console.log("get chat room");
			console.log(user);
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
        .controller("AuthenticationController", ["$scope", "$auth", "$state", "userData", AuthenticationController]);

    function AuthenticationController($scope, $auth, $state, userData) {
        var phc = this;
        console.log("authenticate");
        phc.isAuth = $auth.isAuthenticated();
        if(phc.isAuth){
            $state.go('home.post.all');
        }
        console.log(phc.isAuth);
        phc.authLogout = authLogout;

        phc.socialAuthenticate = socialAuthenticate;
        console.log($state);

        function socialAuthenticate(provider) {

            $auth.authenticate(provider).then(function(response) {
                console.log("from here");
                console.log(response);
                userData.setUser(response.data.user);
                alert('login with ' + provider + ' successfull');
                $state.go('home.post.all');
            }).catch(function(err){
                console.log("error");
                console.log(err);
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
		.controller('HomeController', ['$scope', '$state', HomeController]);

	function HomeController($scope, $state) {
		var hc = this;
		hc.badgeValue= '';
		hc.chatClicked=chatClicked;

		

		function chatClicked(){
			$state.go('home.chat.all');
		}
	}
})(window.angular);

(function(angular){
	'use strict';
  angular.module('petal.home').directive('keepScroll', [
  '$state', '$timeout', 'ScrollPositions', '$ionicScrollDelegate', function($state, $timeout, ScrollPositions, $ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
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
]);
})(window.angular);


(function(angular){
	'use strict';
	angular.module('petal.home')
		.service('homeService',['$http',HomeService]);

		function HomeService($http){
			this.baseURL = 'https://petalchat-imanjithreddy.c9users.io/';
		}
})(window.angular);
(function(angular){
  'use strict';

angular.module('petal.home')
  .service('userAuthService',["$http",'$auth',"baseUrlService",'$mdDialog','userData','$window',UserAuthService]);

/*
  * This servic has a function to get collection of stores`
*/
function UserAuthService($http,$auth,userData){
  
  
        
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
            $http.get(homeService.baseURL+'user/get/'+userId).then(function(res){
              
              if(obj1.isUserExists()){
                  storage.removeItem('user');
              }
              storage.setItem('user',JSON.stringify(res.data.user));
            },function(res){
              console.log(res);
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
	angular.module('petal.people')
		.controller('AllPeopleController', ['$scope', '$state', 'peopleService', AllPeopleController]);

	function AllPeopleController($scope, $state, peopleService) {
		var apc = this;
		apc.getAllPeople = getAllPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;


		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getAllPeople();
		}

		function getAllPeople() {
			peopleService.getAllUsers(apc.params).then(function(response) {
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
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
			getAllPeople();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.post')
		.controller('CreatePostController', ['$scope', '$state', 'postService', CreatePostController]);

	function CreatePostController($scope, $state, postService) {
		var cpc = this;
		cpc.submitPost = submitPost;
		cpc.post = {};
		$scope.$watch(function(){
			return cpc.post.content;
		}, function(newVal, oldVal) {
			if (newVal && newVal.length > 300) {
				cpc.post.content = oldVal;
			}
		});

		function submitPost() {
			postService.submitPost(cpc.post).then(function(response) {
				console.log(response);
			}).catch(function(err) {
				console.log("post error");
				console.log(err);
			});
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('NearbyPeopleController', ['$scope', '$state', 'peopleService', NearbyPeopleController]);

	function NearbyPeopleController($scope, $state, peopleService) {
		var apc = this;
		apc.getNearbyPeople = getNearbyPeople;
		apc.pullRefreshPeople = pullRefreshPeople;
		apc.loadMorePeople = loadMorePeople;


		activate();

		function pullRefreshPeople() {
			activate();

		}

		function loadMorePeople() {
			apc.params.page += 1;
			getNearbyPeople();
		}

		function getNearbyPeople() {
			peopleService.getNearbyUsers(apc.params).then(function(response) {
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});

		}

		function activate() {
			apc.canLoadMoreResults = false;
			apc.initialSearchCompleted = false;
			apc.peopleList = [];
			apc.params = {
				limit: 25,
				page: 1,
				distance: 10
			};
			getNearbyPeople();
		}
	}
})(window.angular);

(function(angular){
	'use strict';
	angular.module('petal.people')
		.controller('PeopleParentController',['$scope','$state',PeopleParentController]);

	function PeopleParentController($scope,$state){

	}
})(window.angular);
(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('ReceivedPeopleController', ['$scope', '$state', 'peopleService', ReceivedPeopleController]);

	function ReceivedPeopleController($scope, $state, peopleService) {
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
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
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
			getReceivedPeople();
		}
	}
})(window.angular);

(function(angular) {
	'use strict';
	angular.module('petal.people')
		.controller('RequestedPeopleController', ['$scope', '$state', 'peopleService', RequestedPeopleController]);

	function RequestedPeopleController($scope, $state, peopleService) {
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
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
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
		.controller('RevealedPeopleController', ['$scope', '$state', 'peopleService', RevealedPeopleController]);

	function RevealedPeopleController($scope, $state, peopleService) {
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
				console.log(response);
				angular.forEach(response.data.docs, function(value) {
					apc.peopleList.push(value);
				});
				apc.initialSearchCompleted = true;
				if (response.data.total > apc.peopleList.length) {
					apc.canLoadMoreResults = true;
				}
			}).catch(function(err) {
				console.log(err);

			}).finally(function() {
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');
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
		.directive('peopleList', ['$ionicPopover', '$state', 'userData',peopleList]);


	function peopleList($ionicPopover, $state,userData) {
		return {
			restrict: 'E',
			templateUrl: 'app/people/views/peopleListTemplate.html',
			scope: {
				peopleList: '=peopleList'
			},
			controller: ['$scope', function($scope) {
				$scope.currentUser = userData.getUser();
				
				$ionicPopover.fromTemplateUrl('app/people/views/peoplePopover.html', {
					scope: $scope,
				}).then(function(popover) {
					$scope.popover = popover;
				});
				$scope.showPopover = function(people, $event) {
					$scope.people = people;
					$scope.popover.show($event, $scope.people);
				};
				$scope.popOverClick = function(type, id) {
					$scope.popover.hide();
					if (type == 'chat') {
						$state.go('chatBox', { user: id });
					}
					if (type == 'profile') {
						$state.go('home.user.userPage', { user: id });
					}
				};
			}]
		};
	}
})(window.angular);

(function(angular) {
  'use strict';
  /*
   *Service for getting a single store with its id
   */
  angular.module('petal.people')
    .service('peopleService', ["$http", "homeService", 'userLocationService', '$q',PeopleService]);

  /*
   * This servic has a function names getStore which takes id as parameter and returns a promise
   */
  function PeopleService($http, homeService, userLocationService,$q) {
    
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

    function getNearbyUsers(params) {
      params.nearby = true;
      var defer = $q.defer();
      userLocationService.getUserLocation().then(function(position) {
        params.latitude = position.latitude;
        params.longitude = position.longitude;
        $http.get(homeService.baseURL + "user/getUsers", { params: params }).then(function(users) {
          defer.resolve(users);
        }).catch(function(err){
          defer.reject(err);
        });
      }).catch(function(err){
        defer.reject(err);
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
		.controller('AllPostController', ['$scope', '$state', 'postService', AllPostController]);

	function AllPostController($scope, $state, postService) {
		var apc = this;
		apc.getAllPosts = getAllPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;

		activate();

		function pullRefreshPosts() {
			activate();

		}

		function loadMorePosts() {
			apc.params.page += 1;
			getAllPosts();
		}

		function getAllPosts() {
			postService.getAllPosts(apc.params).then(function(response) {
				angular.forEach(response.data.docs, function(value) {
					apc.postsList.push(value);
				});
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
			getAllPosts();
		}
	}
})(window.angular);

(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('LatestPostController',['$scope','$state','postService',LatestPostController]);

	function LatestPostController($scope,$state,postService){
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
		.controller('NearbyPostController',['$scope','$state','postService',NearbyPostController]);

	function NearbyPostController($scope,$state,postService){
		var apc = this;
		apc.getNearbyPosts = getNearbyPosts;
		apc.pullRefreshPosts = pullRefreshPosts;
		apc.loadMorePosts = loadMorePosts;
		activate();

		function pullRefreshPosts() {
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
			getNearbyPosts();
		}
	}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('PopularPostController',['$scope','$state',PopularPostController]);

	function PopularPostController($scope,$state){

	}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.post')
		.controller('PostParentController',['$scope','$state',PostParentController]);

	function PostParentController($scope,$state){
		
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
	angular.module('petal.post')
		.directive('postsList', ['$ionicPopover', '$state', 'userData',postsList]);


	function postsList($ionicPopover, $state,userData) {
		return {
			restrict: 'E',
			templateUrl: 'app/post/views/postsListTemplate.html',
			scope: {
				postsList: '=postsList'
			},
			controller: ['$scope', function($scope) {
				$scope.currentUser = userData.getUser();
				
				$ionicPopover.fromTemplateUrl('app/people/views/peoplePopover.html', {
					scope: $scope,
				}).then(function(popover) {
					$scope.popover = popover;
				});
				$scope.showPopover = function(posts, $event) {
					$scope.posts = posts;
					$scope.popover.show($event, $scope.posts);
				};
				$scope.popOverClick = function(type, id) {
					$scope.popover.hide();
					if (type == 'chat') {
						$state.go('chatBox', { user: id });
					}
					if (type == 'profile') {
						$state.go('home.user.userPage', { user: id });
					}
				};
			}]
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

		function getNearbyPosts(params) {
			params.nearby = true;
			var defer = $q.defer();
			userLocationService.getUserLocation().then(function(position) {
				params.latitude = position.latitude;
				params.longitude = position.longitude;
				$http.get(homeService.baseURL + "post/getPosts", { params: params }).then(function(posts) {
					defer.resolve(posts);
				}).catch(function(err) {
					defer.reject(err);
				});
			}).catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;

		}

		function getLatestPosts(params) {
			params.sort = '-time';
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}

		function getPopularPosts(params) {
			params.sort = 'upvotesLength';
			return $http.get(homeService.baseURL + 'post/getPosts', { params: params });
		}

		function submitPost(post) {
			var defer = $q.defer();
			userLocationService.getUserLocation().then(function(position) {
				post.latitude = position.latitude;
				post.longitude = position.longitude;
				$http.post(homeService.baseURL + 'post/create', { post: post }).then(function(response) {
					defer.resolve(response);
				}).catch(function(err) {
					defer.reject(err);
				});
			}).catch(function(err) {
				defer.reject(err);
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
				posObj.distance = Math.ceil(d);
			}).catch(function(err){
				console.log(err);
			});

		}

		function deg2rad(deg) {
			return deg * (Math.PI / 180);
		}

	}
})(window.angular);

(function(angular){
	'use strict';
	angular.module('petal.user').
		controller('UserMePageController',['$state','$auth','userData',UserMePageController]);

		function UserMePageController($state,$auth,userData){
			
			var umpc = this;
			umpc.logout = logout;

			function logout(){
				$auth.logout();
				$state.go('authenticate');
			}
		}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.user').
		controller('UserPageController',['$state','$auth','userService','$stateParams',UserPageController]);

		function UserPageController($state,$auth,userService,$stateParams){
			
			var umpc = this;
			umpc.logout = logout;
			activate();
			function logout(){
				$auth.logout();
				$state.go('authenticate');
			}

			function activate(){
				getUser();
			}

			function getUser(){
				userService.getUser($stateParams.user).then(function(response){
					console.log(":page user");
					console.log(response);
					umpc.user = response.data;
				});
			}
		}
})(window.angular);
(function(angular){
	'use strict';
	angular.module('petal.user').
		controller('UserParentController',['$state','$auth','userData',UserParentController]);

		function UserParentController($state,$auth,userData){
			
		}
})(window.angular);
(function(angular){
  'use strict';
/*
  *Service for getting a single store with its id
*/
angular.module('petal.user')
  .service('userLocationService',['$cordovaGeolocation','userService',UserLocationService]);

/*
  * This servic has a function names getStore which takes id as parameter and returns a promise
*/
function UserLocationService($cordovaGeolocation,userService){
  this.getUserLocation = getUserLocation;
  function getUserLocation(){
    var options = { timeout: 10000, enableHighAccuracy: false };
    return $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      var positions = {latitude:position.coords.latitude, longitude:position.coords.longitude};
      userService.updateUser(positions);    
      return positions;
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
