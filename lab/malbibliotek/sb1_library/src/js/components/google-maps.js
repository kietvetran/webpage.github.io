module.exports = function() {

    var geocoder,
        map,
        marker,
        pos;

    function initialize() {
        geocoder = new google.maps.Geocoder();

        var locationDefault = {lat: 59.9138688, lng: 10.7522454};

        var mapOptions = {
            center: locationDefault,
            zoom: 18,
            scrollwheel: false,
            zoomControl: true,
            disableDefaultUI: true
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        getAddress(locationDefault);
        getGeolocation ();
    }

    function getAddress(locationDefault) {

        var address = $('.maps-canvas').data('location') || locationDefault;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    function getGeolocation () {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = {
                    lat: position.coords.latitude,
                    lang: position.coords.longitude
                };

            }, function() {
                //handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            //handleNoGeolocation(false);
        }
    }

    //Check if google maps script is loaded
    if(typeof google === 'object'){
        google.maps.event.addDomListener(window, 'load', initialize);
    }


};