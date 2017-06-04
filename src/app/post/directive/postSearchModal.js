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
