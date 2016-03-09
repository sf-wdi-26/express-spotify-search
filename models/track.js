var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrackSchema = new Schema({
  artist: String,
  album: String,
  description: String
});

var Track = mongoose.model('Track', TrackSchema);

module.exports = Track;