module.exports = function() {
    
    function getOrigin() {
        if (window.location.origin) {
            return window.location.origin;
        } else {
            return window.location.protocol + 
                   "//" + 
                   window.location.host;
        }
    }

    var videoUrlTemplate ='https://www.youtube.com/embed/' +
        '{{videoId}}' +
        '?origin=' + getOrigin() +
        '&modestbranding=1' +
        '&rel=0' +
        '&showinfo=1' +
        '&theme=light' +
        '&controls=1' +
        '&color=white' +
        '&autohide=1' +
        '&wmode=transparent';

    $('.video iframe').each(function(idx, element) {
        var url = videoUrlTemplate.replace('{{videoId}}', $(element).data('video-id'));
        $(element).attr('src', url);
    });
};
