var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var request = require('request');

var fs = require('fs');

var Twitterkeys = require('./keys.js');

// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says\
// node liri.js my-tweets
// node liri.js spotify-this-song '<song name here>'
// node liri.js movie-this '<movie name here>'

var toDo = process.argv[2];
var search = process.argv[3];

app();

//=======================================================//
//App Logic
//=======================================================//

function app() { 

	if(toDo === "my-tweets") {
		
		getTweets();

	} else if(toDo === "spotify-this-song") {

		if(!search) {
			
			search = "The Sign";
			getSongInfo(search);

		} else {

			for(var i = 4; i < process.argv.length; i++) {
				search = search + process.argv[i] + " ";
			};
			
			getSongInfo(search);

		};
	} else if (toDo === "movie-this") {

		if(!search) {

			search = "Mr. Nobody";
			getOMDB(search);

		} else {

			for(var i = 4; i < process.argv.length; i++) {
				search += " " + process.argv[i];
			};

			getOMDB(search);

		};

	} else if (toDo === "do-what-it-says") {

		read();

	};

};




//=======================================================//
//Twitter
//=======================================================//

function getTweets() {

	var consumer_key = Twitterkeys.consumer_key;
	var consumer_secret = Twitterkeys.consumer_secret;
	var access_token_key = Twitterkeys.access_token_key;
	var access_token_secret = Twitterkeys.access_token_secret;

	var client = new Twitter({
	  consumer_key: consumer_key,
	  consumer_secret: consumer_secret,
	  access_token_key: access_token_key,
	  access_token_secret: access_token_secret
	});
	
	var params = {user_id: 'The Hydra', count: 20};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for(var i =0; i < tweets.length; i++) {
	  		console.log("\nTweet: " + tweets[i].text);
	  		console.log("Tweeted On: " + tweets[i].created_at);
		};
	  }
	});

};

//=======================================================//
//Spotify
//=======================================================//

function getSongInfo(song) {

	var client_id = '73a161e48fb74550a1835d82d4260730';
	var client_secret = '43520d414ab94a0b835ee441d0a737d1'; 

	var spotify = new Spotify({
		id: client_id,
		secret: client_secret
	});

	var params = {type: 'track', query: song, limit: 1};

	spotify.search(params, function(err, data) {

		if (err) {
			return console.log('Error occurred: ' + err);
		}
		
		console.log("\nArtist Name: " + data.tracks.items[0].artists[0].name); 
		console.log("Song Name: " + data.tracks.items[0].name); 
		console.log("Preview Link: " + data.tracks.items[0].artists[0].external_urls.spotify);
		console.log("Album Name: " + data.tracks.items[0].album.name); 

	});

}

//=======================================================//
// OMDB
//=======================================================//

function getOMDB() {

	var baseQueryURL = 'http://www.omdbapi.com/?apikey=trilogy&';

	var fullQueryURL = baseQueryURL + "s=" + search;

	//http://www.omdbapi.com/?apikey=trilogy&s=Men In Black

	request(fullQueryURL, function (error, response, body) {
		console.log("\nMovie Title: " + JSON.parse(body).Search[0].Title);
		console.log("Year Movie Was Made: " + JSON.parse(body).Search[0].Year);
		// PSUEDO CODE **didn't see anywhere in OMDB docs to make this kind of request. Wasn't provided in JSON file using s= parameter
		// * IMDB Rating of the movie.
		// * Rotten Tomatoes Rating of the movie.
		// * Country where the movie was produced.
		// * Language of the movie.
		// * Plot of the movie.
		// * Actors in the movie.

	});

};

function read() {

	fs.readFile('random.txt', "utf8", function(err, data) {
		
		if(err) {

			console.log(err);

		} else {

			var dataArr = data.split(",");
			console.log(dataArr);
			toDo = dataArr[0];
			search = dataArr[1];
			app();
		}
	});

};