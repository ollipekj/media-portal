
var homepageController = angular.module('homepageController', []);

homepageController.controller('homepageController', 
	['$scope', '$http', function($scope, $http){
		
	$scope.links = [];
	$scope.linkInfo = "";
	$scope.serverStatus ="";

	$http.get('/links')
	.success(function(data){			
		console.log("success" + angular.toJson(data));
		$scope.links = data;
		console.log($scope.links);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});	
	
	$scope.deleteAllLinks = function(){
		$http.delete('/links')
		.success(function(data){			
			$scope.serverStatus = "Links deleted successfully";
			$scope.links = data;
		})
		.error(function(data) {
			$scope.serverStatus = "Error while deleting links";;
		});
	}
	
	$scope.deleteLink = function(id){
		$http.delete('/links/' + id)
		.success(function(data){			
			$scope.serverStatus = "Link deleted successfully";
			$scope.links = data;
		})
		.error(function(data) {
			$scope.serverStatus = "Error while deleting a link";
		});
	}
	
	$scope.createLink = function(){
	
		var link = {
			name: $scope.linkInfo.name,
			url: $scope.linkInfo.url		
		};
		
		$http.post('/links', angular.toJson(link))
		.success(function(data) {
			$scope.serverStatus = "Link created successfully";
		})
		.error(function(data) {
				$scope.serverStatus = "Error while creating a link";
		});
	}
}]);
