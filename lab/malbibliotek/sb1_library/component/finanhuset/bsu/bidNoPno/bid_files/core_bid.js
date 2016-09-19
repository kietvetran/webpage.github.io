//	_______________________________________________
//	core_bid.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// This is the main script for the BankID client (bid.html).
// It's very important to note that the client can run in two different modes (bid.mode). Either:
//
// a. regular mode (running through a scenario as usual) or
// b. document mode
//
//
// If in regular mode then it initializes the application in one of two ways:
//
// a1. If there is a parent frame (Brukersted / index_tmpl) then the client will postmessage a client ready event
// (bid.pm.BID_CLIENT_READY) and listen for response on which scenario to run (bid.pm.SCENARIO_RUN).
//
// a2. If there _is no_ parent frame then the BankID client is on it's own and runs a (predefined) scenario
// (ie. #7 for http://localhost/bid.html#7)


// Log the application name and version
//log(bid.app.toString());

//	Constants
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.IS_TOUCH_DEVICE = 'ontouchstart' in document.documentElement;
bid.REGULAR_MODE = 'regular_mode';
bid.DOCUMENT_MODE = 'document_mode';


// store the scrollbar width/height (size)
bid.SCROLLBAR_SIZE = 0;

$(function () {

    // we'll have to instanciate a new div to do some testing
    var scrollDiv = document.createElement("div");

    // the class will ensure the scrollbars are "turned on"
    scrollDiv.className = "scrollbar-measure";

    // make it part of the DOM
    document.body.appendChild(scrollDiv);

    // retrieve width (size) of the scrollbar
    bid.SCROLLBAR_SIZE = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // remove div from the DOM
    document.body.removeChild(scrollDiv);
});

//	bid.e (events)
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.e = {
    INTERACTIVE_EVENT: 'click',
    INTERACTIVE_START: bid.IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown',
    INTERACTIVE_END: bid.IS_TOUCH_DEVICE ? 'touchend' : 'mouseup',
    // INTERACTIVE_MOVE: 				bid.IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove',
    // INTERACTIVE_OUT: 				bid.IS_TOUCH_DEVICE ? 'ontouchcancel' : 'mouseout',
    INTERACTIVE_OVER: 'mouseover',

    NEW_PAGE_START: 'next_page_start',
    NEW_PAGE_END: 'next_page_end',

    NO_NEW_PAGE: 'no_new_page',

    GOTO_PREVIOUS_PAGE: 'goto_previous_page',
    GOTO_NEXT_PAGE: 'goto_next_page',

    GOTO_PREVIOUS_SUB_PAGE: 'goto_previous_sub_page',
    GOTO_NEXT_SUB_PAGE: 'goto_next_sub_page'
}

// instanciate the mediator
bid.mediator = new bid.Mediator();

// document ready handler
jQuery(function () {

    $('html').toggleClass(
        bid.IS_TOUCH_DEVICE
            ? 'touch'
            : 'no-touch'
    );

    var ie_ver = getInternetExplorerVersion();

    if (ie_ver > -1)
        $('html').addClass('ie' + ie_ver);

});

// listen for post messages
window[bid.addEventListener]('message', function (e) {
    if (bid.domain != '*' && e.origin != bid.domain)
        return;


    var data = JSON.parse(e.data);

    switch (data.cmd) {
        case bid.pm.SCENARIO_RUN:

            var scenario;
            $.each(bid.scenarios, function (key, val) {
                if (val.id == data.sid) {
                    scenario = val;
                    return false;
                }
            });
            bid.mediator.init(scenario);

            break;
    }
}, false);


// Preloader for images.
$.fn.preloadImages = function (callback) {
    checklist = this.toArray();
    this.each(function () {
        $('<img>').attr({ src: this }).load(function () {
            checklist.remove($(this).attr('src'));
            if (checklist.length == 0) {
                callback();
            }
        });
    });
};


// Removes a particular element from stack.
Array.prototype.remove = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            this.splice(i, 1);
        }
    }
};

// Now it's important to know which mode we'll be running in.
bid.mode = getURLParameter('doc') == 'null' && getURLParameter('sid') == 'null'
    ? bid.REGULAR_MODE
    : bid.DOCUMENT_MODE
;

// So which mode should we be runnin in?
switch (bid.mode) {

    case bid.DOCUMENT_MODE:
        // Okay so we're supposed to show a document.

        var scenarioId = getURLParameter('sid');

        var sce = $.grep(bid.scenarios, function (val, key) {
            return val.id == scenarioId;
        })[0];

        // copy the scenario details
        var scenario = $.extend(true, {}, sce);

        // this is the main difference between the original scenario object and this new scenario object
        scenario.steps = [sce.wait];

        bid.mediator.init(scenario);

        break;

    case bid.REGULAR_MODE:
    default:
        // It's business as usual.

        if (window.location !== window.parent.location && false) {
            // we're within an iframe
            // that means we'll have to notify the parent (brukersted / index_tmpl.html) that we're ready to go

            // set up parameters to post
            var param = {
                cmd: bid.pm.BID_CLIENT_READY
            };

            // post message to parent that we're ready to go
            window.parent.postMessage(JSON.stringify(param), bid.domain);

        } else {

            // Okay so we'll run a scenario without a parent.
            // Let's parse which scenario to run based on the hash.
            var scenarioId = location.hash
                    ? location.hash.substring(1)
                    : 0 // default if no index is found
                ;
            bid.mediator.init(bid.scenarios[scenarioId]);
        }
        break;

}