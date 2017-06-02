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
