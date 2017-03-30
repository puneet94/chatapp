(function(angular) {
	'use strict';
	angular.module('petal.post')
		.directive('postsList', ['$ionicPopover', '$state', 'userData', 'postService', 'upvoteService', '$ionicModal',postsList]);


	function postsList($ionicPopover, $state, userData, postService, upvoteService,$ionicModal) {
		return {
			restrict: 'E',
			templateUrl: 'app/post/views/postsListTemplate.html',
			scope: {
				postsList: '=postsList',
				postSearchTextSubmit: '&postSearchTextSubmit'
			},
			controller: ['$scope', function($scope) {
				loadPostModal();
				$scope.getTime = function(time){
					return moment(time).fromNow(true);
				};
				$scope.currentUser = userData.getUser();

				$scope.setPostSearch = function(interest){
					if($scope.postSearchTextSubmit){
						$scope.postSearchTextSubmit({interest:interest});	
					}
					
				};
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
						$scope.postModal.userPage(id);
					}
				};
				function userPage(id){
					$state.go('home.user.userPage', { user: id });
					if($scope.modal){
						$scope.modal.hide();
					}
				
				}
				function loadPostModal() {
					$ionicModal.fromTemplateUrl('app/post/views/postModal.html', {
						scope: $scope
					}).then(function(modal) {
						$scope.modal = modal;
					});
				}
				$scope.postModal = {};
				$scope.postModal.userPage = userPage;
				$scope.postModal.getSinglePost = getSinglePost;

				$scope.postModal.submitPostUpvote = submitPostUpvote;
				$scope.postModal.deletePostUpvote = deletePostUpvote;
				$scope.postModal.getPostDistance = getPostDistance;

				$scope.showPostModal = function(id) {
					$scope.postModal.id = id;
					activate();
					$scope.modal.show();
				};

				function activate() {
					getSinglePost();
					checkPostUpvote();
				}

				function getSinglePost() {
					postService.getPost($scope.postModal.id).then(function(response) {
						$scope.postModal.post = response.data;
						$scope.postModal.distanceObj = {
							latitude: $scope.postModal.post.loc[1],
							longitude: $scope.postModal.post.loc[0],
							diatance: 0
						};
						getPostDistance();


					});

				}

				function checkPostUpvote() {
					upvoteService.getUpvote($scope.postModal.id).then(function(res) {

						$scope.postModal.postUpvoted = res.data;
						console.log("post upvote");
						console.log(res);
						console.log($scope.postModal.postUpvoted);
					}).catch(function(err) {
						console.log("check error");
						console.log(err);
					});
				}

				function submitPostUpvote() {
					upvoteService.createUpvote($scope.postModal.id).then(function(res) {
						checkPostUpvote();
						console.log("check submit");
						console.log(res);
					}).catch(function(err) {
						console.log("submit error");
						console.log(err);
					});
				}

				function deletePostUpvote() {
					upvoteService.deleteUpvote($scope.postModal.id).then(function(res) {
						checkPostUpvote();
						console.log("delete ");
						console.log(res);
					}).catch(function(err) {
						console.log("delete error");
						console.log(err);
					});
				}

				function getPostDistance() {
					postService.getDistance($scope.postModal.distanceObj);
				}

			}]
		};
	}
})(window.angular);
