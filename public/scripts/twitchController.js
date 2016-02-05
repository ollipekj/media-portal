
var twitchController = angular.module('twitchController', []);

twitchController.controller('twitchViewController', 
	['$scope', '$http', '$sce', '$interval', function($scope, $http, $sce, $interval){
	
	$scope.streamEntries = [];
	$scope.onlineStreams = [];
	$scope.offlineStreams = [];
	$scope.streamPlayer = "";
		
	// Get all streams when the page is displayd
	$scope.getStreams = function(){
		$http.get('/twitch/streams/')
		.success(function(data){			
			$scope.getStreamStatuses(data);
			console.log("got streams");
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});	
	};
		
	$scope.getStreams();
	$interval($scope.getStreams, 60000);
	
	$scope.playChannel = function(url){
		
		var plyerHtml = "<iframe src='http://player.twitch.tv?channel=" + url +"' width='100%' height='640' scrolling='no' allowfullscreen></iframe>";	
		//console.log(sfd);	
		$scope.streamPlayer = $sce.trustAsHtml(plyerHtml);
	}
	
	$scope.getStreamStatuses = function(data){
		
		var params = '';
		
		for(var i in data){
			params += data[i].name + ',';
		}		
		params = params.substring(0, params.length-1);
		
		$http.get('https://api.twitch.tv/kraken/streams?channel=' + params)
		.success(function(streamData){		
		
			var onlineNames = [];
			var streams = [];
			var temp = [];
			streams = streamData.streams;
			
			// These streams are online
			for(var s in streams){
				temp.unshift($scope.getStreamObject(
					streams[s].channel.logo,
					streams[s].channel.display_name,
					"",
					'Playing ' + streams[s].game,
					streams[s].channel.url
				));
				onlineNames.push(streams[s].channel.display_name);
			};

			// These streams are offline
			for(var d in data){
				var name = data[d].name;
				if($.inArray(name, onlineNames) == -1){
					temp.push($scope.getStreamObject(
						data[d].logo,
						data[d].name,
						'Offline',
						"",
						data[d].url
					));
				};
			};
			//$scope.streamEntries = temp;
			$scope.onlineStreams = temp.slice(0, onlineNames.length);
			$scope.offlineStreams = temp.slice(onlineNames.length, temp.length);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
	
	$scope.getStreamObject = function(logo, name, status, game, url){
		return {
			logo: logo,
			name: name,
			status: status,
			game: game,
			url: url
		};	
	}
}]);

twitchController.controller('streamDeleteHandler', 
	['$scope', '$http', function($scope, $http){
	
	$scope.streams = "";
	$scope.serverStatus;
	
	$http.get('twitch/streams/')
		.success(function(data){			
			$scope.streams = data;			
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});
	
	$scope.deleteStream = function(id){
		//console.log(id);		
		$http.delete('/twitch/streams/' + id)
		.success(function(data){			
			$scope.streams = data;	
			$scope.serverStatus = "Stream deleted successfully";			
		})
		.error(function(data) {
			$scope.serverStatus = "Failed to delete the stream";
		});		
	}
	
	$scope.deleteAllStreams = function(){
		$http.delete('/twitch/streams/')
		.success(function(data){			
			$scope.serverStatus = data;
		})
		.error(function(data) {
			$scope.serverStatus = data;
		});
	}

}]);
	
twitchController.controller('twitchModificationController', 
	['$scope', '$http', function($scope, $http){
	
	$scope.fromAPI = {};
	$scope.serverStatus = '';
	$scope.savedStreams = [];
	$scope.streamSearchTerm = '';
	
	$scope.getStreamData = function(){
		$http.get('https://api.twitch.tv/kraken/channels/' + $scope.streamSearchTerm)
		.success(function(data){			
			$scope.fromAPI = data;			
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
	
	$scope.getSavedStreams = function(){
		$http.get('twitch/streams/')
		.success(function(data){			
			$scope.savedStreams = data;			
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
			
	$scope.createStream = function(){
	
		var stream = {
			logo: $scope.fromAPI.logo,
			name: $scope.fromAPI.display_name,
			url: $scope.fromAPI.url			
		};
		
		$http.post('/twitch/streams/', angular.toJson(stream))
		.success(function(data) {
			$scope.serverStatus = data;
		})
		.error(function(data) {
			$scope.serverStatus = data;
		});
	}
}]);