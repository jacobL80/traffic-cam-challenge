"use strict";

$(document).ready(function() {
    var mapElem = document.getElementById('map');

    var markers = [];

    var seattle = new google.maps.Map(mapElem, {
        center: {
	        lat: 47.6,
	        lng: -122.3
	    	},
        zoom: 12
    });

    var infoWindow = new google.maps.InfoWindow();

    $.getJSON('https://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
			data.forEach(function(station) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(station.location.latitude),
                        lng: Number(station.location.longitude)
                    },
                    map: seattle,
                    camera: station.cameralabel,
                    animation: google.maps.Animation.DROP
                });

                // opens and pans to a marker
                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<p>' + station.cameralabel + '</p>';
                        html += '<img src="' + station.imageurl.url + '" />';
                        infoWindow.setContent(html);
                        infoWindow.open(seattle, this);
                        seattle.panTo(marker.getPosition());
                });

                // Closes a marker by clicking on the map
                google.maps.event.addListener(seattle, 'click', function() {
                    var html = '<p>' + station.cameralabel + '</p>';
                        html += '<img src="' + station.imageurl.url + '" />';
                        infoWindow.close(marker);
                });

                markers.push(marker);
            });
        })
        .fail(function(error) {
            alert(error);
        });

    //resizes the map to fit into the current window's size
    $( window ).resize(function() {
		var positions = $('#map').position().top;
		var mapsize = $( window ).height() - positions - 20;
    	$('#map').height(mapsize);
	});

    $("#search").bind('search keyup', function() {
        var search = document.getElementById('search').value.toLowerCase();
        for (var i = 0; i < markers.length; i++) {
            var searchString = markers[i].camera.toLowerCase();

            if (searchString.indexOf(search) != -1) {
                markers[i].setMap(seattle);
            } else {
                markers[i].setMap(null);
            }
        };
    });
});