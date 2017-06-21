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