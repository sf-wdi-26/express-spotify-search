// wait for DOM to load before running JS
$(function() {

  // base API route
  var baseUrl = '/api/tracks';

  // array to hold track data from API
  var allTracks = [];

  // element to display list of tracks
  var $tracksList = $('#tracks-list');

  // form to create new track
  var $createTrack = $('#create-track');

  // compile handlebars template
  var source = $('#tracks-template').html();
  var template = Handlebars.compile(source);

  // helper function to render all tracks to view
  // note: we empty and re-render the collection each time our track data changes
  var render = function() {
    // empty existing tracks from view
    $tracksList.empty();

    // pass `allTracks` into the template function
    var tracksHtml = template({ tracks: allTracks });

    // append html to the view
    $tracksList.append(tracksHtml);
  };

  // GET all tracks on page load
  $.get(baseUrl, function (data) {
    console.log(data);

    // set `allTracks` to track data from API
    allTracks = data.tracks;

    // render all tracks to view
    render();
  });

  // listen for submit even on form
  $createTrack.on('submit', function (event) {
    event.preventDefault();

    // serialze form data
    var newTrack = $(this).serialize();

    // POST request to create new track
    $.post(baseUrl, newTrack, function (data) {
      console.log(data);

      // add new track to `allTracks`
      allTracks.push(data);

      // render all tracks to view
      render();
    });

    // reset the form
    $createTrack[0].reset();
    $createTrack.find('input').first().focus();
  });

  // add event-handlers to tracks for updating/deleting
  $tracksList

    // for update: submit event on `.update-track` form
    .on('submit', '.update-track', function (event) {
      event.preventDefault();
      
      // find the track's id (stored in HTML as `data-id`)
      var trackId = $(this).closest('.track').attr('data-id');

      // find the track to update by its id
      var trackToUpdate = allTracks.filter(function (track) {
        return track._id == trackId;
      })[0];

      // serialze form data
      var updatedTrack = $(this).serialize();

      // PUT request to update track
      $.ajax({
        type: 'PUT',
        url: baseUrl + '/' + trackId,
        data: updatedTrack,
        success: function(data) {
          // replace track to update with newly updated version (data)
          allTracks.splice(allTracks.indexOf(trackToUpdate), 1, data);

          // render all tracks to view
          render();
        }
      });
    })
    
    // for delete: click event on `.delete-track` button
    .on('click', '.delete-track', function (event) {
      event.preventDefault();

      // find the track's id (stored in HTML as `data-id`)
      var trackId = $(this).closest('.track').attr('data-id');

      // find the track to delete by its id
      var trackToDelete = allTracks.filter(function (track) {
        return track._id == trackId;
      })[0];

      // DELETE request to delete track
      $.ajax({
        type: 'DELETE',
        url: baseUrl + '/' + trackId,
        success: function(data) {
          // remove deleted track from all tracks
          allTracks.splice(allTracks.indexOf(trackToDelete), 1);

          // render all tracks to view
          render();
        }
      });
    });

});