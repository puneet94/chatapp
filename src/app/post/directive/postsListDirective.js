(function(angular) {
	'use strict';
	angular.module('petal.post')
		.directive('postsList', ['$rootScope','$state', 'userData', 'postService', 'upvoteService', '$ionicModal',postsList]);


	function postsList( $rootScope,$state, userData, postService, upvoteService,$ionicModal) {
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
				scope.$on('$destroy', function() {

					
  				});
				$rootScope.$on('$stateChangeStart', function() {
					if(scope.modal){
						scope.modal.remove();	
					}
   					
				});
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
