
var podcastController = angular.module('podcastController', []);

podcastController.controller('podcastController', 
	['$scope', '$http', '$sce', function($scope, $http, $sce) {
		
		$scope.soundcloudPodcasts = [];
		$scope.soundcloudUrl = "";	
		$scope.serverStatus = "";		
		
		$http.get('/podcasts/soundcloud')
		.success(function(data){			
			$scope.populatePodcastList(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		
		$scope.populatePodcastList = function(data){
			
			$scope.soundcloudPodcasts = [];
			for(d in data){				
				$scope.soundcloudPodcasts.push({
					_id: data[d]._id,
					title: data[d].title,
					html: $sce.trustAsHtml(data[d].html)
				});
			}
		};
		
		$scope.createSoundcloudEntry = function(url){
			var url = {
				url: $scope.soundcloudUrl
			};
			console.log(angular.toJson($scope.soundcloudUrl));
			$http.post('/podcasts/soundcloud', angular.toJson(url))
			.success(function(data) {
				$scope.serverStatus = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		};
		
		$scope.deleteAllPodcasts = function(){
			$http.delete('/podcasts/soundcloud')
			.success(function(data){			
				$scope.serverStatus = "Podcast deleted successfully";
				$scope.populatePodcastList(data);
			})
			.error(function(data) {
				$scope.serverStatus = "Error while deleting podcasts";
			});
		}
	
		$scope.deletePodcast = function(id){
			console.log(id);
			
			$http.delete('/podcasts/soundcloud/' + id)
			.success(function(data){			
				$scope.serverStatus = "Podcast deleted successfully";
				$scope.populatePodcastList(data);
			})
			.error(function(data) {
				$scope.serverStatus = "Error while deleting a podcast";
			});
		}
		
}]);
