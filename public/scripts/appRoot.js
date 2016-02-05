// public/core.js
var portalApp = angular.module('portalApp', ['ngSanitize', 
											'ngRoute', 
											'homepageController',
											'twitchController',
											'podcastController']);

portalApp.directive('navbar', function(){	
	return{
		templateUrl: '/views/navbar.html'
	};
});

portalApp.directive('activetoggler', function(){	
	return{
		link: function(scope, element, attr) {
			element.on('click', function(event) {
				$(".active").removeClass("active");
				element.addClass("active");
			});
		}
	};
});
											
portalApp.config(function($routeProvider, $locationProvider){

    $routeProvider.
	when('/twitch', {
		templateUrl: 'views/twitchView.html',
		controller: 'twitchViewController'
	}).
	when('/addTwitchStream', {
		templateUrl: 'views/settingViews/addTwitchStream.html',
		controller: 'twitchModificationController'
	}).
	when('/removeTwitchStream', {
		templateUrl: 'views/settingViews/removeTwitchStream.html',
		controller: 'streamDeleteHandler'
	}).
	when('/podcasts', {
		templateUrl: 'views/podcastView.html',
		controller: 'podcastController'
	}).
	when('/addSoundcloudEntry', {
		templateUrl: 'views/settingViews/addSoundcloudEntry.html',
		controller: 'podcastController'
	}).
	when('/removeSoundcloudEntry', {
		templateUrl: 'views/settingViews/removeSoundcloudEntry.html',
		controller: 'podcastController'
	}).
	when('/home', {
		templateUrl: 'views/homeView.html',
		controller: 'homepageController'
	}).
	when('/addLink', {
		templateUrl: 'views/settingViews/addLink.html',
		controller: 'homepageController'
	}).
	when('/removeLink', {
		templateUrl: 'views/settingViews/removeLink.html',
		controller: 'homepageController'
	});
	  
	$locationProvider.html5Mode(true);
});