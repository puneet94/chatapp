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
