//	_______________________________________________
//	mediator.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
/*

 */

//	bid.Mediator
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.Mediator = function () {

    var self = {
            init: init
        },

        _scenario,

    // outer page manager
        _outerPage,

    // page manager
        _manager,

    // a jQuery set of all page elements
    // whenever a page is (de)activated this is the elements to perform filters upon (ie. toggle class="active")
        $pages,

        resizeTimeout
        ;

    // hides all pages and shows a page based on a filter (css selector)
    function show(filter) {
        $pages
            .toggleClass('active', false)
            .filter(filter)
            .toggleClass('active', true)
        ;
    }

    // preloads a bunch of... hold it.... hold it... IMAGES!
    function preloadImages(callback) {
        show('.preload');

        // list of bitmaps to preload
        var urls = [
            'bidlogo',
            'close',
            'fnr',
            'last-fail',
            'last-used',
            'lock',
            'next',
            'otp-bim',
            'otp-calculator',
            'otp-card',
            'pwd',
            'close_white'
        ];

        // add prefix and suffx to each image
        var prefix = Modernizr.svg ? 'template/svg/' : 'template/img/ico/';
        var suffix = Modernizr.svg ? '.svg' : '.png';

        // prepare the full url for each image
        urls = $.map(urls, function (val) {
            return prefix + val + suffix;
        });

        // add further bitmaps
        urls.push(
            'template/img/ajax-loader.gif'
        );

        // set an upper limit for how long we'll wait
        var timeout = window.setTimeout(callback, 5000);

        // preload images
        $(urls).preloadImages(function () {
            clearTimeout(timeout);
            callback();
        });
    }

    function runUseCase() {

        show('.case');

        _manager.show(0);
//		_manager.show(1);
//		_manager.show(2);
//		_manager.show(3);
//		_manager.show(4);
//		_manager.show(5);
    }

    function eventHandler(e, data) {
        switch (e.type) {
            case bid.e.GOTO_PREVIOUS_PAGE:
                _manager.show('-1');
                break;
            case bid.e.GOTO_NEXT_PAGE:
                _manager.show('+1');
                break;
            case bid.e.GOTO_PREVIOUS_SUB_PAGE:
                _manager.getCurrentPageObject().gotoPreviousSubPage(data);
                break;
            case bid.e.GOTO_NEXT_SUB_PAGE:
                _manager.getCurrentPageObject().gotoNextSubPage(data);
                break;
        }
    }

    function init(scenario) {

        _scenario = scenario;

        var $this = $(this);

        $this.bind([
            bid.e.GOTO_PREVIOUS_PAGE,
            bid.e.GOTO_NEXT_PAGE,
            bid.e.GOTO_PREVIOUS_SUB_PAGE,
            bid.e.GOTO_NEXT_SUB_PAGE
        ].join(' '), eventHandler);

        // we'll have to wait for the DOM ready...
        $(function () {

            // page manager
            _manager = new bid.page.Manager($('#pg_case ul.pages'), scenario, $this);

            $(window).bind('resize orientationchange', function () {
                clearTimeout(resizeTimeout);

                // let's be careful about resizing the body with continous resize events
                resizeTimeout = setTimeout(resizeBody, 50);
            });

            // let's update the layout right away
            resizeBody();

            _outerPage = new bid.OuterPage($('#hd, #ft'), scenario, {
                showAbout: function () {
                    show('.about');
                },
                showCase: function () {
                    show('.case');
                },
                showPrivacy: function () {
                    show('.privacy');
                },
                showSertificate: function () {
                    show('.sertificate');
                }
            }, $this);

            $(_manager).bind([
                bid.e.NEW_PAGE_START,
                bid.e.NEW_PAGE_END
            ].join(' '), _outerPage.handleNewPage);

            $(_manager).bind([
                bid.e.NEW_PAGE_START,
                bid.e.NEW_PAGE_END
            ].join(' '), resizeBody);

            // no new page handler
            // Whenever the page manager broadcasts that there are
            // no futher pages to display this handler kicks in.
            $(_manager).bind(bid.e.NO_NEW_PAGE, function (e) {
                // bid.app.location('index_tmpl.html', {
                // 	sid: _scenario.id,
                // 	action: 'success'
                // });

                // set up parameters to post
                var param = {
                    cmd: bid.pm.BID_CLIENT_SUCCESS,
                    sid: _scenario.id
                };
                // post message to parent that user canceled
                window.parent.postMessage(JSON.stringify(param), bid.domain);
            });

            $('#btn_close_case').bind(bid.e.INTERACTIVE_EVENT, function (e) {

                // NOT IN USE: just applies the url on the top parent
                // bid.app.location('index_tmpl.html', {
                // 	sid: _scenario.id,
                // 	action: 'cancel'
                // });

                // IN USE: posts a message that the client has canceled the process
                // set up parameters to post
                var param = {
                    cmd: bid.pm.BID_CLIENT_CANCEL,
                    sid: _scenario.id
                };
                // post message to parent that user canceled
                window.parent.postMessage(JSON.stringify(param), bid.domain);

            });

            $('#btn_close_document').bind(bid.e.INTERACTIVE_EVENT, function (e) {

                window.close();

            });

            // store an easy jQuery reference to all pages
            $pages = $('.wrp.top > .wrp > .pg');

            $pages.find('.btnBack').bind(bid.e.INTERACTIVE_EVENT, function () {
                show('.case');
            });

            // preload images and run the use case
            preloadImages(runUseCase);

        });
    }

    // on resize handler
    // Makes sure that the inner wrapper (that wraps the ul/li page-elements) makes use of the full available height.
    // (Width is set to 100% and already works out-of-the box)
    function resizeBody() {

        var $inner = $('#bd > .wrp');

        // remove excessive height that might disturb the outer height calculation
        $inner.height('');

        var bounds = bid.page.getBounds();

        $inner.height(bounds.height);
    }

    // listen for post messages
    window[bid.addEventListener]('message', function (e) {
        if (bid.domain != '*' && e.origin != bid.domain)
            return;


        var data = JSON.parse(e.data);

        switch (data.cmd) {

            // when an iframe has loaded content it broadcasts the width and height
            case bid.pm.PAGE_LOADED:
                if (_manager.getCurrentPageObject().initPage)
                    _manager.getCurrentPageObject().initPage(data);
                break;

            // when an iframe changes size it broadcasts the width and height
            case bid.pm.PAGE_RESIZED:
                if (_manager.getCurrentPageObject().updateSize)
                    _manager.getCurrentPageObject().updateSize(data);
                break;

            case bid.pm.TAB_CLOSED:
                alert('received: ', data);
                break;
        }
    }, false);

    return self;

}
;

(function () {

    // if the $el is not displayed (display:none) width and height will be 0 (zero)
    // therefore we'll keep track of the last bounds that was valid
    var _bounds;

    // retrieves the width and height of the body.
    // bounds = page height - ( header height + footer.height )
    bid.page.getBounds = function () {
        var $el = $(window);

        var hd = $('#hd').hasClass('hide')
                ? 0
                : $('#hd').outerHeight()
            ;

        var ft = $('#ft').hasClass('hide')
                ? 0
                : $('#ft').outerHeight()
            ;

        var height = $(window).height() - 2 - hd - ft;
        // store the new bounds to _bounds
        _bounds = {
            width: $el.width(),
            height: height
        };

        return _bounds;
    };

}());