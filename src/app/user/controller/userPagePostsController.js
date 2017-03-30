(function(angular) {
	'use strict';
	angular.module('petal.user').
	controller('UserPagePostsController', ['$state',  '$stateParams', 'friends',UserPagePostsController]);

	function UserPagePostsController($state,  $stateParams,friends) {
		alert(friends);


		
	}
})(window.angular);
