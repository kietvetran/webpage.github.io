

bid.zoom = (function(){

    "use strict";

    var zoom_step = 0.1, _min, _max, _iscroll, zoom;

    function doScale( value ){

        // Set new zoom factor
        _iscroll.zoom(
            _iscroll.x * (0.97 - (_iscroll.scale - value)), // try to stay in about the same position
            _iscroll.y * (0.97 - (_iscroll.scale - value)),
            value
        );

        // Refresh iScroll GUI
        _iscroll.refresh();

        // Update zoom tool GUI
        updateObservables();

    }

    function iOSversion() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
        return []
    }

    function updateObservables(){

        // Fix iOS5 scale bug -> https://bugs.webkit.org/show_bug.cgi?id=15676
        if(iOSversion()[0] == 5){
            _iscroll.scroller.firstElementChild.style.zoom = 1 / _iscroll.scale;
        }

        // Set the zoom text
        zoom.text( Math.round( 100 / _min * _iscroll.scale ) + "%" );

        // Enable / disable zoom buttons if min / max is current
        zoom.isMin( _iscroll.scale == _min );
        zoom.isMax( _iscroll.scale == _max );

        // position and size for indicator
        zoom.indicator({
            left :   Math.round( 15 * ( _iscroll.x * -1 ) / _iscroll.scrollerW ),
            top :    Math.round( 20 * ( _iscroll.y * -1 ) / _iscroll.scrollerH ),
            width :  Math.max( Math.round( 15 * _iscroll.wrapperW / _iscroll.scrollerW ), 2 ),
            height : Math.max( Math.round( 20 * _iscroll.wrapperH / _iscroll.scrollerH ), 2 )
        });

    }

    // Public methods
    zoom = {

        init : function(iscroll){

            // Set as current
            _iscroll = iscroll;

            // Min and max zoom
            _min = _iscroll.options.zoomMin;
            _max = _iscroll.options.zoomMax;

            // Event listeners
            _iscroll.options.onZoomEnd = updateObservables;
            _iscroll.options.onZoom = updateObservables;
            _iscroll.options.onScrollMove = updateObservables;
            _iscroll.options.onScrollEnd = updateObservables;

            // debug
            //window.iscroll = iscroll;

            // let the view get ready
            setTimeout( updateObservables, 300 );

        },

        zoomIn : function(){
            doScale( Math.min( _iscroll.scale + zoom_step, _max ) );
        },

        zoomOut : function(){
            doScale( Math.max( _iscroll.scale - zoom_step, _min ) );
        },

        // Enable / dissable zoom out and reset button
        isMin : ko.observable( true ),

        // Enable / dissable zoom in button
        isMax : ko.observable( false ),

        // Zoom level text in percent
        text : ko.observable( "100%" ),

        // The page view indicator data
        indicator : ko.observable({
            left :    0,
            top :     0,
            width :  15,
            height : 20
        })

    }

    // Distribute public methods
    return zoom;

}());

// Desktop zoom fallback


bid.zoom.iZoom = function iZoom(id, p){

    var self = this;

    var element = self.element = document.getElementById(id);
    var inner = self.inner = self.element.firstElementChild;
    var iframe = self.iframe = inner.querySelector("iframe");

    self.x = 0;
    self.y = 0;

    self.options = {

        zoomMax : 1,
        zoomMin : 0.2,
        original : {
            width : inner.offsetWidth,
            height : inner.offsetHeight
        }

    }

    self.wrapperW = element.offsetWidth;
    self.wrapperH = element.offsetHeight;

    self.scrollerW = inner.offsetWidth;
    self.scrollerH = inner.offsetHeight;

    self.scale = 1;

    for( var i in p ){
        if(p.hasOwnProperty(i)){
            self.options[i] = p[i];
        }
    }

    element.style.overflow = "auto";
    element.style.zIndex = "1";// Webkit bugfix

    element.querySelector(".veil").style.display = "none";

    // trigger the scrollbars to show in Chrome
    element.scrollTop = 10;
    element.scrollTop = 0;

    // Update pageindicator on scroll (zoom.js)
    element.addEventListener("scroll",function(ev){

        self.y = this.scrollTop * -1;
        self.x = this.scrollLeft * -1;

        if(typeof self.options.onScrollMove === "function"){
            self.options.onScrollMove()
        }
    },false);

    iframe.contentDocument.body.addEventListener( "dblclick", function( ev ){

        var ieFix = bid.vendorPrefix === "ms" ? self.scale : 1;

        if( self.scale != self.options.zoomMax ){

            self.zoom(
                Math.max(ev.offsetX / ieFix - (self.wrapperW / 2),0),
                Math.max(ev.offsetY / ieFix - (self.wrapperH / 2),0),
                self.options.zoomMax
            );

        }else{

            self.zoom( 0, Math.abs(self.y) * self.options.zoomMin, self.options.zoomMin );
        }

    },false);

}

bid.zoom.iZoom.prototype.zoom = function zoom( x, y, factor ){

    var self = this;

    self.options.zoomMin = self.zoomMin || self.options.zoomMin;
    self.options.zoomMax = self.zoomMax || self.options.zoomMax;

    self.scale = factor;

    var newW = ( this.options.original.width * factor ),
        newH = ( this.options.original.height * factor );

    if(bid.vendorPrefix != "ms"){
        // Use css transform for sane browsers
        self.inner.style[ bid.vendorPrefix + "TransformOrigin" ] = "0 0";
        self.inner.style[ bid.vendorPrefix + "Transform" ] = "scale(" + factor + ")";

    }else{
        // IE is crap on css transform scale
        newW -= 18; newH -= 18;
        self.iframe.style.width = newW + "px";
        self.iframe.style.height = newH + "px";

    }

    self.inner.style.width = newW + "px";
    self.inner.style.height = newH + "px";

    self.scrollerW = self.inner.offsetWidth;
    self.scrollerH = self.inner.offsetHeight;

    self.element.scrollTop = Math.abs(y);
    self.element.scrollLeft = Math.abs(x);

    if(typeof self.options.onZoom === "function"){
        self.options.onZoom()
    }

    // Temp fix for unwanted vertical scrollbar in Windows and Linux
    // TODO: Fix this
//    if(self.scale == self.options.zoomMin){
//        self.element.style.overflowX = "hidden";
//    }else{
//        self.element.style.overflowX = "scroll";
//    }

};

/**
 * Refresh handles the resizing
 */
bid.zoom.iZoom.prototype.refresh = function(){

    var self = this,
        element = this.element,
        inner = this.inner;

    self.wrapperW = element.offsetWidth;
    self.wrapperH = element.offsetHeight;

    self.scrollerW = inner.offsetWidth;
    self.scrollerH = inner.offsetHeight;

    bid.zoom.init(self)

}

