// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

// connect to mongodb
mongoose.connect('mongodb://localhost/spotify-app');

// require Track model
var Track = require('./models/track');


// HOMEPAGE ROUTE

app.get('/', function (req, res) {
  res.render('index');
});


// API ROUTES

// get all tracks
app.get('/api/tracks', function (req, res) {
  // find all tracks in db
  Track.find(function(err, allTracks){
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ tracks: allTracks });
    }
  });
});

// create new track
app.post('/api/tracks', function (req, res) {
  // create new track with form data (`req.body`)
  var newTrack = new Track(req.body);
  
  // save new track in db
  newTrack.save(function(err, savedTrack){
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(savedTrack);
    }
  });
});

// get one track
app.get('/api/tracks/:id', function (req, res) {
  // get track id from url params (`req.params`)
  var trackId = req.params.id;

  // find track in db by its id
  Track.findOne({ _id: trackId }, function(err, foundTrack){
    if(err){
      if(err.name === "CastError"){
        res.status(404).json({ error: "Nothing found by this ID." });
      } else {
        res.status(500).json({ error: err.message });
      }
    } else {
      res.json(foundTrack);
    }
  });
});
 
// update track
app.put('/api/tracks/:id', function (req, res) {
  // get track id from url params (`req.params`)
  var trackId = req.params.id;

  // find track in db by its id
  Track.findOne({ _id: trackId }, function(err, foundTrack){
    if(err) {
      res.status(500).json({ error: err.message });
    } else {
      //update the track's attributes
      foundTrack.title = req.body.title;
      foundTrack.artist = req.body.artist;
      foundTrack.description = req.body.description;

      // save updated track in db
      foundTrack.save(function(err, savedTrack){
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(savedTrack);
        }
      });
    }
  });
});

// delete track
app.delete('/api/tracks/:id', function (req, res) {
  // get track id from url params (`req.params`)
  var trackId = req.params.id;

  // find track in db and remove
  Track.findOneAndRemove({ _id: trackId }, function(err, deletedTrack){
    if(err){
      res.status(500).json({ error: err.message });
    } else {
      res.json(deletedTrack);
    }
  });
});


// listen on port 3000
app.listen(3000, function() {
  console.log('server started');
});