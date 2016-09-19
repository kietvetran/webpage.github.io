// Check if Browser supports the origin property
if ( !window.location.origin ) {
    // If not then implement it
    window.location.origin = window.location.protocol + 
                             "//" + 
                             window.location.host;
};
// Create this template to be used as url for Youtube videos
var videoUrlTemplate ='http://www.youtube.com/embed/' + 
                      '{{videoId}}' +
                      '?origin=' + window.location.origin +
                      '&modestbranding=1' +
                      '&rel=0' +
                      '&showinfo=1' +
                      '&theme=light' +
                      '&controls=1' +
                      '&color=white' +
                      '&autohide=1';

// Go through each video wrapper on the page and start it.l
$('.video iframe').each( function( idx, element) {
    // formulate the url for the current iframe
    var url = videoUrlTemplate.replace( '{{videoId}}', $(element).data('video-id') );
    // Get the video id from the iframe and get it's source
    $(element).attr( 'src', url );
});

