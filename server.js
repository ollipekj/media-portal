// server.js

    var express  = require('express');
    var app      = express();                              
    var mongoose = require('mongoose');                    
    var morgan = require('morgan');             
    var bodyParser = require('body-parser');    
    var methodOverride = require('method-override'); 
	var request = require("request");

    app.use(express.static(__dirname + '/public'));                 
    app.use(morgan('dev'));                                       
    app.use(bodyParser.urlencoded({'extended':'true'}));            
    app.use(bodyParser.json());                                    
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
    app.use(methodOverride());

	// Schemas --	
	// Twitch stream entries
	var twitchSchema = new mongoose.Schema({
		logo: String,
		name: String,
		url: String		
	}); 	
	var TwitchStream = mongoose.model('TwitchStream', twitchSchema);
	
	// Soundcloud entries
	var soundcloudSchema = new mongoose.Schema({
		title: String,
		html: String		
	}); 	
	var SoundcloudWidget = mongoose.model('SoundcloudWidget', soundcloudSchema);
	
	// Link parent collection
	var linkSchema = new mongoose.Schema({
		title: String,
		url: String
	}); 	
	var Link = mongoose.model('Link', linkSchema);
	
	
	// connect to database
	mongoose.connect('localhost:27017');	
		
	// Links API	
	// Create a new link
	app.post('/links', function(req, res){
		console.log("saving link " + req.body.name);
		var link = new Link({
			title: req.body.name,
			url: req.body.url
		});			
		link.save(function(err, link){			
			if(err)
				res.send('Failed to add the Link');
			else
				res.send('Link added successfully');
		});
	});
	
	// Returns all links
	app.get('/links', function(req, res){
						
		Link.find(function(err, links){
			//console.log(streams);
			if(err)
				res.send('Failed to get streams');
			else
				res.json(links);
		});
	});
	
	// Delete all link objects
	app.delete('/links', function(req, res){
		//console.log("posting " + req.body.name);
				
		Link.remove({}, function(err){
			if(err)
				res.send('Removal failed');
			else
				res.send('Deleted all links');
		});		
	});
	
	// Delete a single link object
	app.delete('/links/:_id', function(req, res) {
	
		var id = req.params._id;
		console.log("Deleting link " + id);
		Link.remove({
            _id : id
        }, function(err, link) {
            if (err)
                res.send(err);
			else{
					Link.find(function(err, links){
						res.json(links);
				});
			}
		});
	});
	
	
	// Twitch stream API		
	app.post('/twitch/streams', function(req, res){
		console.log("posting " + req.body.name);
		var stream = new TwitchStream({
			name: req.body.name,
			logo: req.body.logo,
			url: req.body.url
		});	
		
		stream.save(function(err, stream){			
			if(err)
				res.send('Failed to add the stream');
			else
				res.send('Stream added successfully');
		});
	});
	
	// Get all stream objects
	app.get('/twitch/streams', function(req, res){
						
		TwitchStream.find(function(err, streams){
			//console.log(streams);
			if(err)
				res.send('Failed to get streams');
			else
				res.json(streams);
		});
	});
	
	// Delete single stream object
	app.delete('/twitch/streams/:_id', function(req, res) {
		console.log("deleting a stream");
		var id = req.params._id;
		
		TwitchStream.remove({
            _id : id
        }, function(err, stream) {
            if (err)
                res.send(err);
			else{
					TwitchStream.find(function(err, streams){
						res.json(streams);
				});
			}
		});
	});
		
	// Delete all stream objects
	app.delete('/twitch/streams', function(req, res){
		//console.log("posting " + req.body.name);
				
		TwitchStream.remove({}, function(err){
			if(err)
				res.send('Removal failed');
			else
				res.send('Deleted all streams');
		});		
	});
	
	// Podcasts API
	// Create a soundcloud widget reference
	app.post('/podcasts/soundcloud', function(req, res) {
		
		var url = createSoundcloudWidgetUrl(req.body.url);
		
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				var title = result.title;
				var html = result.html;
				console.log(title + ", " + html);
				var podcastEntry = new SoundcloudWidget({
					title: title,
					html: html
				});
				
				podcastEntry.save(function(err, podcastEntry){			
					if(err)
						res.send('Failed to add the podcast');
					else
						res.send('Podcast added succesfully');
				});
			}
		});
	});

	function createSoundcloudWidgetUrl(url){
		var baseUrl = 'http://soundcloud.com/oembed?';
		var params = 'iframe=true&format=json&maxheight=166';
        var encoded = encodeURIComponent(url);
		return baseUrl + params + '&url=' + encoded;
	};
	
	// Get all soundcloud entries
	app.get('/podcasts/soundcloud', function(req, res){
						
		SoundcloudWidget.find(function(err, soundcloudWidgets){
			console.log(soundcloudWidgets);
			if(err)
				res.send('Failed to get the podcasts');
			else
				res.json(soundcloudWidgets);
		});
	});
	
	// Delete a single podcast object
	app.delete('/podcasts/soundcloud/:_id', function(req, res) {
		var id = req.params._id;
		
		SoundcloudWidget.remove({
            _id : id
        }, function(err, soundcloudWidgets) {
            if (err)
                res.send(err);
			else{
					SoundcloudWidget.find(function(err, soundcloudWidgets){
						res.json(soundcloudWidgets);
				});
			}
		});
	});

	
	// Launch the application
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });
	
    app.listen(8080);
    console.log("App listening on port 8080");
