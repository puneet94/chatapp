(function(angular) {
	'use strict';
	var peopleModule = angular.module('petal.people');
	peopleModule.directive('peopleSearchModal', ['$rootScope','$ionicModal', 'peopleService',peopleSearchModal]);

	function peopleSearchModal($rootScope,$ionicModal, peopleService) {
		return {
			restrict: 'A',
			scope: {
				peopleSearchModal: '@'
			},
			link: function(scope, elem) {
				
				scope.peopleSearchData = {};
				scope.peopleSearchData.peopleSearchModal = scope.peopleSearchModal;
				scope.peopleSearchData.peopleList = [];
				scope.modalsList = [];
				scope.clickPeopleSearch = clickPeopleSearch;
				scope.showPeopleModal = function() {
					loadPeopleModal().then(function() {
						scope.modal.show();
						
					});
					scope.$on('modal.hidden', function() {

						scope.modal.remove();
					});
				};
				$rootScope.$on('$stateChangeStart', function() {
					if(scope.modal){
						scope.modal.remove();	
					}
   					
				});
				scope.getPeople = function(params) {
					peopleService.getAllUsers(params).then(function(response) {
						
						angular.forEach(response.data.docs, function(value) {
							scope.peopleSearchData.peopleList.push(value);
						});
						scope.peopleSearchData.noPeople = !response.data.total;
						scope.peopleSearchData.initialSearchCompleted = true;
						if (response.data.total > scope.peopleSearchData.peopleList.length) {
							scope.peopleSearchData.canLoadMoreResults = true;
						} else {
							scope.peopleSearchData.canLoadMoreResults = false;
						}
					});
				};
				function clickPeopleSearch(){
					scope.peopleSearchData.peopleList = [];
					var params = {
						interest: scope.peopleSearchData.peopleSearchModal ,
						page: 1,
						limit: 50
					};
					scope.getPeople(params);
				}
				function loadPeopleModal() {
					return $ionicModal.fromTemplateUrl('app/people/views/peopleSearchModal.html', {
						scope: scope
					}).then(function(modal) {
						scope.modal = modal;
						
					});
				}
				elem.bind('click', function(event) {
					var params = {
						interest: scope.peopleSearchData.peopleSearchModal ,
						page: 1,
						limit: 50
					};
					scope.showPeopleModal();
					event.stopPropagation();
					scope.getPeople(params);
				});
			}
		};

	}

})(window.angular);
