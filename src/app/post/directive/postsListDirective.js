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
					return moment(time).fromNow(true);
				};
				scope.currentUser = userData.getUser();

				scope.setPostSearch = function(interest){
					if(scope.postSearchTextSubmit){
						scope.postSearchTextSubmit({interest:interest});	
					}
					
				};
				
				function userPage(id){
					$state.go('home.user.userPage', { user: id });
					if(scope.modal){
						scope.modal.hide();
					}
				
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
				scope.postModal.getSinglePost = getSinglePost;

				scope.postModal.submitPostUpvote = submitPostUpvote;
				scope.postModal.deletePostUpvote = deletePostUpvote;

				scope.showPostModal = function(id) {
					scope.postModal.id = id;
					activate();
					loadPostModal().then(function(){

						scope.modal.show();	
					});
					scope.$on('modal.hidden', function() {
    						
    						scope.modal.remove();
  					});
					
				};

				function activate() {
					getSinglePost();
					checkPostUpvote();
				}

				function getSinglePost() {
					postService.getPost(scope.postModal.id).then(function(response) {
						scope.postModal.post = response.data;

					});

				}

				function checkPostUpvote() {
					upvoteService.getUpvote(scope.postModal.id).then(function(res) {

						scope.postModal.postUpvoted = res.data;
						
					}).catch(function(err) {
						console.log("check error");
						console.log(err);
					});
				}

				function submitPostUpvote() {
					upvoteService.createUpvote(scope.postModal.id).then(function(res) {
						checkPostUpvote();
						
					}).catch(function(err) {
						console.log("submit error");
						console.log(err);
					});
				}

				function deletePostUpvote() {
					upvoteService.deleteUpvote(scope.postModal.id).then(function(res) {
						checkPostUpvote();
						
					}).catch(function(err) {
						
						window.alert(err);
					});
				}

				

			}
		};
	}

	
})(window.angular);
