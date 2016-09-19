//	_______________________________________________
//	page.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾


//	bid.page.Manager
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Instanciates and tracks the pages that the user navigates between.

// param $el		jQuery element to the page's container
// param scenario 	a bid.Scenario object
bid.page.Manager = function ($el, scenario, $mediator) {

    // a shortcut reference
    var bps = bid.page.step;

    var _pages = [],
        _numSteps = scenario.steps.length,
        _current // integer
        ;

//    if (scenario.documentSource) {
//        var documentsIterator = new bid.Iterator(scenario.documentSource);
//    }

    var self = {
        show: show,
        getCurrent: getCurrent,
        getCurrentPageObject: getCurrentPageObject
//        ,onResize: onResize
    };

    // Displays a particular page.
    // param index:int 	a zero indexed page number
    function show(index) {
        if (index === '+1')
            index = _current + 1;
        else if (index === '-1')
            index = _current - 1;

        // The scenario is completed?
        if (index >= _numSteps) {
            // notice listeners
            $(self).trigger(bid.e.NO_NEW_PAGE);
            return;
        }

        // trying to go out of bounds?
        if (index >= _numSteps || index < 0) {
            throw 'Error: index out of bounds (' + index + ').';
        }

        // have we instanciated such a page yet?
        if (!_pages[index]) {
            for (var i = _pages.length; i <= index; i++)
                add(i);
        }

        activate(index);
//        $(window).resize();
    }

    // returns the current page index
    function getCurrent() {
        return _current;
    }

    // returns the current page object
    function getCurrentPageObject() {
        return _pages[_current];
    }

    // Adds a page to the stack.
    // param index:int 	a zero indexed page number
    function add(index) {

        // get template markup and append to DOM
        $el.append(getMarkup(index));

        handleNewPage(index);
    }

    function handleNewPage(index) {

        // the step we're configuring
        var step = scenario.steps[index];

        var fn;

        // any special options to pass to the new page constructor will be defined in this object
        var options = {};

        switch (step) {
            case bps.PID:
                fn = bid.page.PID;
                break;
            case bps.OTP:
                fn = bid.page.OTP;
                break;
            case bps.PWD:
                fn = bid.page.PWD;
                break;
            case bps.CHG_INFO:
            case bps.CHG_CONFIRMATION:
                fn = bid.page.CHG_INFO;
                break;
            case bps.CHG_PWD:
                fn = bid.page.CHG_PWD;
                break;
            case bps.SGN_INTRO:
                fn = bid.page.SGN_INTRO;
                break;
            case bps.SGN_DOCUMENT:
            case bps.SGN_DOCUMENT_TXT:
            case bps.SGN_DOCUMENT_HTML:
                options = scenario.documentSource;
                fn = bid.page.SGN_DOCUMENT;
                break;
            case bps.SGN_CONFIRM:
                fn = bid.page.SGN_CONFIRM;
                break;
            case bps.SGN_RECEIPT:
                fn = bid.page.SGN_RECEIPT;
                break;
            case bps.SGN_WAIT:
                fn = bid.page.SGN_WAIT;
                break;
            default:
                throw new Error('No step/page function defined for: ' + step.type);
        }

        _pages[index] = new fn(
            self,
            scenario,
            $pg(index),
            options
        );
    }


    var _duration = Modernizr.csstransitions ? 510 : 0;
    var _timeout;

    // activates a particular page in the stack
    // index is zero-based
    function activate(index) {

        // visually shift to the new page
        $el.css('left', (index * -100) + '%');

        // shift the "current" tag to the new page DOM-element
        $el.find('> .pg')
            .toggleClass('active', false)
            .eq(index).toggleClass('active', true)
        ;

        // prepare the event to be triggered
        var event_obj = {
            index: index,
            page: scenario.steps[index],
            obj: _pages[index]
        };

        // notice listeners
        $(self).trigger(bid.e.NEW_PAGE_START, event_obj);

        // deactivate the current page
        try {
            _pages[_current].deactivate();
            clearTimeout(_timeout);
        } catch (err) {
        }

        // keep track of which page is now the current one
        _current = index;

        // wait for animation to complete (duration is set in CSS)
        _timeout = window.setTimeout(function () {
            // activate the current page
            try {
                _pages[_current].activate();
            } catch (err) {
            }

            // notice listeners of page
            $(self).trigger(bid.e.NEW_PAGE_END, event_obj);
        }, _duration);
    }

    function getMarkup(index) {
        var step = scenario.steps[index];
        return $('#' + step.tmpl).html();
    }

    // Returns a jquery object of the page.
    // param index:int 	a zero indexed page number
    function $pg(index) {
        return $el.children().eq(index);
    }

    // on resize handler
    // (is called from the mediator)
//    function onResize() {
//        // not all page objects has an update function
//        try {
//            getCurrentPageObject().update();
//        } catch (err) {
//        }
//    }

    return self;

};


//	bid.page.PID
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.PID = function (mgr, scenario, $el) {
    var _vm = new ViewModel(scenario);

    function ViewModel() {
        var self = this;

        self.defaultText = ko.observable('11 siffer');
        self.inputType = 'tel';
        self.err = ko.observable(false);
        self.feedback = ko.observable(self.defaultText());
        self.inputVal = ko.observable();
        self.isValid = ko.computed(function () {
            return bid.password.fn.isLength(self.inputVal(), 11);
        });
    }

    ko.applyBindings(_vm, $el.get(0));

    var $input = $el.find('input');

    function isValid(val) {
        var regex = /([0-9]){11}/g;
        return regex.test(val);
    }

    $el.find('form').submit(function (e) {
        e.preventDefault();


        var val = $input.val();

        var isEmpty = bid.password.fn.isEmpty(val),
            isNumber = bid.password.fn.isNumber(val),
            isLength = bid.password.fn.isLength(val, 11),
            valid = isValid(val)
            ;

        _vm.err(!valid);

        if (isEmpty)
            _vm.feedback('Vennligst fyll ut fødselsnummer (11 siffer).');
        else if (!isNumber || !isLength)
            _vm.feedback('Fødselsnummer må bestå av (kun) 11 siffer.');
        else if (!valid)
            _vm.feedback('Ikke gyldig fødselsnummer.');


        if (!valid) {
            $input.focus();
            return false;
        }

        _vm.feedback(_vm.defaultText());
        mgr.show('+1');
        // $(mgr).trigger('next');
    });

    this.activate = function () {
        if (!bid.IS_TOUCH_DEVICE)
            $input.focus();
    };

    this.deactivate = function () {
        $input.blur();
    }

};


//	bid.page.OTP
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.OTP = function (mgr, scenario, $el) {

    var _vm = new ViewModel(scenario);

    ko.applyBindings(_vm, $el.get(0));
    ko.applyBindings(_vm, $('.dlg.otp_menu .private.list').get(0));

    $el.find('form').submit(function (e) {

        e.preventDefault();

        var valid = _vm.item().password.validator.fn(_vm.inputVal());

        _vm.err(_vm.errStep || valid !== true);

        if (valid === true) {
            if (_vm.errStep) {
                _vm.feedback(scenario.error.message);
            } else {
                _vm.feedback(_vm.defaultText());
                mgr.show('+1');
            }
        }
        else {
            _vm.feedback(valid);
            _vm.inputFocus(true);
        }
        return false;

    });

    function ViewModel(scenario) {
        var self = this;

        self.errStep = scenario.error && scenario.error.step == bid.page.step.OTP;

        // boolean, whether or not there is multiple OTPs involved
        self.otp_multiple = scenario.hasMultiple;

        // template name (string)
        self.tmpl_otp_inp = ko.observable('tmpl_otp_inp_' + (scenario.hasMultiple ? 'multiple' : 'single'));

        // array name of OTPs (string)
        self.otp_array_name = ko.observable('personal');

        // current array
        self.otp_array = ko.observableArray(scenario.otp[self.otp_array_name()]);

        // whether there is an error or not
        self.err = ko.observable(false);

        // the index of the current OTP
        self.index = ko.observable(0);

        // the OTP computed from the index
        self.item = ko.computed(function () {
            return self.otp_array()[self.index()];
        });

        // the input type (necessary to show keypad on touch devices)
        self.inputType = ko.computed(function () {
            switch (self.item().password.type) {
                case 'number':
                    return 'tel';
                default:
                    return 'text';
            }
        });

        // the input value
        self.inputVal = ko.observable();

        self.isValid = ko.computed(function () {
            return bid.password.fn.isLength(self.inputVal(), self.item().password.len);
        });

        // the input focus
        self.inputFocus = ko.observable();

        // the default instructions to the user
        self.defaultText = ko.computed(function () {
            return self.item().name + ', ' + self.item().password.label;
        });

        // the current instructions/feedback to the user
        self.feedback = ko.observable(self.defaultText());

        // Returns CSS class name for an OTP.
        self.otpClass = function (item) {
            return 'svg ' + item.device;
        };

        // Returns CSS class name for the current item.
        self.otpClassCurrent = ko.computed(function () {
            return self.otpClass(self.item());
        });

        self.otpSelectClicked = function () {
            displayOTPMenu(true);

            setTimeout(function () {
                $('body').one(bid.e.INTERACTIVE_EVENT, function (e) {
                    self.err(false);
                    displayOTPMenu(false);
                });
            }, 10);
        };

        self.otpDeviceClicked = function (obj, e, index) {
            self.index(index);
            self.feedback(self.defaultText());
            displayOTPMenu(false);
            _vm.inputFocus(true);
        };

        return self;
    }

    function displayOTPMenu(bool) {
        $('.dlg.otp_menu').toggleClass('active', bool);
    }

    this.activate = function () {
        if (!bid.IS_TOUCH_DEVICE)
            _vm.inputFocus(true);
    };

    this.deactivate = function () {
        _vm.inputFocus(false);
    };

};


//	bid.page.PWD
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.PWD = function (mgr, scenario, $el) {

    // var $input = $el.find('input');

    var _vm = new ViewModel(scenario),
        _timeout;

    ko.applyBindings(_vm, $el.get(0));
    var $input = $el.find('input');

    $input.bind(bid.e.INTERACTIVE_EVENT, function (e) {
        endHandler(e);
    });

    $el.find('.showme')
        .bind('oncontextmenu contextmenu', function (e) {
            e.preventDefault();
            return false;
        })
        .bind(bid.e.INTERACTIVE_START, function (e) {
        })
        .bind(bid.e.INTERACTIVE_END, function (e) {
        })
        .bind(bid.e.INTERACTIVE_EVENT, function (e) {
            clearTimeout(_timeout);
            if (_vm.pwdVisible()) {
                endHandler(e);
                // $input.blur();
            }
            else {
                startHandler(e);
                // $input.focus();
            }
        })
    ;

    $el.find('.inp input').bind(bid.e.INTERACTIVE_EVENT, function (e) {
        endHandler(e);
    });

    function startHandler(e) {
        _vm.pwdVisible(true);

        // hide it no matter what after a couple of seconds
        _timeout = setTimeout(function () {
            _vm.pwdVisible(false);
        }, 5000);

        // $input.blur();
        _vm.inputFocus(false);
    }

    function endHandler(e) {
        clearTimeout(_timeout);

        _vm.pwdVisible(false);
        _vm.inputFocus(true);
        // $input.focus();
    }

    $el.find('form').submit(function (e) {

        e.preventDefault();

        var val = _vm.inputVal();

        var valid = (function () {
            if (bid.password.fn.isEmpty(val))
                return 'Vennligst fyll ut passord (minst 8 tegn).';
            if (!bid.password.fn.isMinLength(val, 8))
                return 'Passord må bestå av minst 8 tegn.';

            return true;
        }());

        _vm.err(_vm.errStep || valid !== true);

        if (valid === true) {
            if (_vm.errStep) {
                _vm.feedback(scenario.error.message);
            } else {
                _vm.feedback(_vm.defaultText());
                mgr.show('+1');
            }
        }
        else {
            _vm.feedback(valid);
            // _vm.inputFocus(true);
            endHandler(e);
        }
        return false;

    });

    function ViewModel(scenario) {
        var self = this;

        self.errStep = scenario.error && scenario.error.step == bid.page.step.PWD;

        // the input value
        self.inputVal = ko.observable('');
        self.pwdVisible = ko.observable(false);
        self.err = ko.observable(false);
        self.defaultText = ko.observable('Minst 8 tegn');
        self.feedback = ko.observable(self.defaultText());
        // the input focus
        self.inputFocus = ko.observable();
        self.isValid = ko.computed(function () {
            return bid.password.fn.isMinLength(self.inputVal(), 8);
        });
        self.toggleText = ko.computed(function () {
            return self.pwdVisible()
                ? 'Skjul'
                : 'Vis'
                ;
        });

        return self;
    }

    this.activate = function () {
        // only display if there is no last failed message
        if (!bid.IS_TOUCH_DEVICE && !scenario.used.fail)
            _vm.inputFocus(true);
    };

    this.deactivate = function () {
        _vm.inputFocus(false);
    }

};


// bid.page.CHG_INFO
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.CHG_INFO = function (mgr, scenario, $el) {

    $el.find('form').submit(function (e) {

        e.preventDefault();
        mgr.show('+1');

    });

};


// bid.page.CHG_PWD
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.CHG_PWD = function (mgr, scenario, $el) {

    var _vm = new ViewModel(scenario),
        _timeout;

    ko.applyBindings(_vm, $el.get(0));

    function ViewModel(scenario) {
        var self = this;

        // the input value
        self.inputVal = ko.observable('');
        self.pwdVisible = ko.observable(false);

        self.err = ko.observable(false);
        self.errInput = ko.observable(false);

        self.checkedConfirm = ko.observable(false);

        self.defaultText = ko.observable('');
        self.feedback = ko.observable(self.defaultText());

        // the input focus
        self.inputFocus = ko.observable();
        self.isValid = ko.computed(function () {
            return bid.password.fn.isMinLength(self.inputVal(), 8);
        });

        self.toggleText = ko.computed(function () {
            return self.pwdVisible()
                ? 'Skjul'
                : 'Vis'
                ;
        });

        return self;
    }

    $el.find('.showme')
        .bind('oncontextmenu contextmenu', function (e) {
            e.preventDefault();
        })
        .bind(bid.e.INTERACTIVE_EVENT, function (e) {
            clearTimeout(_timeout);
            if (_vm.pwdVisible())
                endHandler(e);
            else
                startHandler(e);
        })
    ;

    $el.find('.inp input').bind(bid.e.INTERACTIVE_EVENT, function (e) {
        endHandler(e);
    });

    function startHandler(e) {
        _vm.pwdVisible(true);

        // hide it no matter what after a couple of seconds
        _timeout = setTimeout(function () {
            _vm.pwdVisible(false);
        }, 5000);

        _vm.inputFocus(false);
    }

    function endHandler(e) {
        clearTimeout(_timeout);

        _vm.pwdVisible(false);
        _vm.inputFocus(true);
    }

    this.activate = function () {
        // only display if there is no last failed message
        if (!bid.IS_TOUCH_DEVICE)
            _vm.inputFocus(true);
    }

    $el.find('form').submit(function (e) {

        e.preventDefault();

        var val = _vm.inputVal();

        var valid = (function () {
            if (bid.password.fn.isEmpty(val))
                return 'Vennligst fyll ut passord (minst 8 tegn).';
            if (!bid.password.fn.isMinLength(val, 8))
                return 'Passord må bestå av minst 8 tegn.';

            return true;
        }());

        _vm.errInput(valid !== true);

        if (valid === true && !_vm.checkedConfirm())
            valid = 'Vennligst bekreft passordet';

        _vm.err(valid !== true);

        if (valid === true) {
            _vm.feedback(_vm.defaultText());
            mgr.show('+1');
        }
        else {
            _vm.feedback(valid);
            endHandler(e);
        }
        return false;

    });

};

// bid.page.SGN_INTRO
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.SGN_INTRO = function (mgr, scenario, $el) {

    $el.find('form').submit(function (e) {
        e.preventDefault();
        mgr.show('+1');
    });

};

// bid.page.SGN_DOCUMENT
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.SGN_DOCUMENT = function (mgr, scenario, $el, options) {

    // constant
    var MAX_DOCUMENT_WIDTH = 2048;

    // private members
    var _vm,
        _delay = 1,
        _timeout,
        _ratio
        ;
    var computedSize = function (observable) {
        return ko.computed({
            read: function () {
                return observable()
                    ? observable() + 'px'
                    : '100%'
                    ;
            },
            write: function (val) {
                observable(val);
            }
        });
    };

    // an array with prepared viewmodels
    var _pages = $.map(options, function (val, key) {
        var index = val.lastIndexOf('.') + 1;

        var ret = {
            fileType: val.substr(index),
            url: val + '&index=' + key,
            index: key,
            w: ko.observable(bid.page.getBounds().width),
            h: ko.observable(bid.page.getBounds().height),
            loading: ko.observable(true),
            ratio: 0,
            origW: null,
            origH: null,
            iscroll: null
        };

        return ret;
    });

    function ViewModel() {
        var self = this;

//        self.outerWidth = ko.observable();
//        self.outerHeight = ko.observable();

        self.pages = ko.observableArray();

        self.index = ko.observable(0);

        self.currentPageIndex = ko.computed({
            read: function () {
                return self.index();
            },
            write: function (index) {
                if (index >= self.pages().length)
                    self.addPage(index);
                else {
                    self.index(index);
                }
            }
        });

        self.addPage = function (index) {

            var pg = _pages[index];
            self.pages.push(pg);

            // we're officially at the new page
            self.currentPageIndex(index);

            // let's wait for the transition
            setTimeout(function () {
                // src must be set independently of knockout - otherwise the src updates whenever we change other attributes
                // through the attr-binding
                get$iframe(index).prop('src', pg.url);
            }, 500); // we'll wait 500 ms so that animations are completed before loading anything
        };

        // Event handler for page load. When an iframe loads a new document it broadcasts a postmessage which is picked
        // up by the mediator and distributed to this method.
        self.initPage = function (obj) {

            if (obj.index == null)
                throw 'No index found for this page.';

            var pg = self.pages()[obj.index];

            pg.ratio = obj.height / obj.width;

            pg.origW = obj.width;
            pg.origH = obj.height;

            pg.loading(false);

            initScrollZoom(pg);
        };

        // Event handler for changes to the iframe's document size change. Only TXT and HTML documents broadcast this
        // event which is distributed through the mediators postmessage handler. This is an important change since its
        // the document flow that changes the height, not necessarily the ratio itself.
        self.updateSize = function (obj) {

            var pg = self.pages()[obj.index];

            pg.h(obj.height);

            if (pg.iscroll) {
                bid.zoom.init(pg.iscroll);
                pg.iscroll.refresh();
            }

        };
        return self;
    }


    function initScrollZoom(pg) {

        var timeout;

        // the first time there is no delay
        var delay = 0;

        var id = 'iframe-doc-' + pg.index;
        var $wrp = $('#' + id);
        var _maxZoomFactor;


        // let's subscribe to any page changes
        _vm.currentPageIndex.subscribe(function (index) {
            // are we at this page's index
            if (index == pg.index) {
                // if so we'll listen for resize
                $(window).on('resize', update);
                update();
            } else {
                // otherwise remove listener
                $(window).off('resize', update);
            }
        });

        // since we're initializing the page, and can assume that the page is already loaded and displayed, we'll
        // add an window resize listener right away.
        $(window).on('resize', update).resize();

        function update() {

            clearTimeout(timeout);

            /*
             Prepare a timeout so that we don't exhaust the system whenever a user is (continuously) resizing the window.
             When a set time has passed we'll update the dimensions of content and give notice to iScroll to act on the
             new dimension.
             */
            timeout = setTimeout(function () {

                var bounds = bid.page.getBounds();

                $wrp.width(bounds.width);
                $wrp.height(bounds.height);

                switch (pg.fileType) {
                    case 'svg':
                    case 'png':
                        _maxZoomFactor = MAX_DOCUMENT_WIDTH / bounds.width;
                        if (bid.IS_TOUCH_DEVICE) {
                            pg.w(bounds.width * _maxZoomFactor);
                            pg.h(bounds.width * pg.ratio * _maxZoomFactor);
                        } else {
                            // Adjust the width according to scrollbar size. The scrollbar is also adjusted according to
                            // the zoom factor.
                            pg.w(MAX_DOCUMENT_WIDTH - (bid.SCROLLBAR_SIZE * _maxZoomFactor));
                            pg.h(MAX_DOCUMENT_WIDTH * pg.ratio);
                        }
                        break;
                    case 'html':
                    case 'txt':
                    default:
                        _maxZoomFactor = 1;

                        // Is there need for a scrollbar?
                        // If there is we'll adjust the width of the content so that the scrollbar is taken into account.
                        var scrollbarCorrection = pg.h() < bounds.height
                                ? bid.SCROLLBAR_SIZE * _maxZoomFactor
                                : 0
                            ;

                        // Since we're never going to scale the iframe's contents we don't have to bother with adjusting
                        // scrollbar size with zoom factor.
                        pg.w(bounds.width - bid.SCROLLBAR_SIZE);
                        pg.h(bounds.height);
                        break;
                }

                var zoomMin = 1 / _maxZoomFactor;//.IS_TOUCH_DEVICE ? 1 / _maxZoomFactor : 1;
                var zoomMax = 1;//bid.IS_TOUCH_DEVICE ? 1 : _maxZoomFactor;

                var prop = {
                    zoom: true,
                    zoomMin: zoomMin,
                    zoomMax: zoomMax,
                    doubleTapZoom: zoomMin,
                    vScroll: true,
                    hScroll: true,
                    vScrollbar: true,
                    hScrollbar: true,

                    // this ensures that the scrollbar stays put, even on iOS
                    hideScrollbar: false
                };

                if (!pg.iscroll) {

                    pg.iscroll = bid.IS_TOUCH_DEVICE ? new iScroll(id, prop) : new bid.zoom.iZoom(id, prop);

                } else {

                    pg.iscroll.options.zoomMin = zoomMin;
                    pg.iscroll.options.zoomMax = zoomMax;

                    pg.iscroll.wrapperW = $wrp.width();
                    pg.iscroll.wrapperH = $wrp.height();

                    pg.iscroll.scrollerW = bounds.width;
                    pg.iscroll.scrollerH = bounds.height;

//                    pg.iscroll.wrapperW = bounds.width;
//                    pg.iscroll.wrapperH = bounds.height;
//
//                    pg.iscroll.scrollerW = MAX_DOCUMENT_WIDTH;
//                    pg.iscroll.scrollerH = MAX_DOCUMENT_WIDTH * pg.ratio;

                }

                pg.iscroll.zoom(0, 0, zoomMin, 0);

                // TODO: Fix this. The statement produces an error; scrollTo is not a valid method
                // pg.iscroll.scrollTo(0,0);
                bid.zoom.init(pg.iscroll);
                pg.iscroll.refresh();

                delay = 50;

            }, delay);

        }


    }

    function get$iframe(index) {
        return $el.find('iframe').eq(index);
    }

    function gotoPreviousSubPage(data) {
        _vm.currentPageIndex(data);
    }

    function gotoNextSubPage(data) {
        _vm.currentPageIndex(data);
    }

    // setup the view model
    _vm = new ViewModel();
    _vm.currentPageIndex(0);


    // bind view model to DOM
    ko.applyBindings(_vm, $el.get(0));

    function getWindowWidth() {
        var orientation = window.orientation;

        if (orientation !== undefined)
            switch (orientation) {
                case 90:
                case -90:
                    return $(window).height();
                default:
                    return $(window).width();
            }

        return $(window).width();
    }

    $el.find('form').submit(function (e) {
        e.preventDefault();
        mgr.show('+1');
    });

    // public members
    return {
        updateSize: _vm.updateSize,
        initPage: _vm.initPage,
        gotoPreviousSubPage: gotoPreviousSubPage,
        gotoNextSubPage: gotoNextSubPage
    };
};

// bid.page.SGN_DOCUMENT
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.SGN_CONFIRM = function (mgr, scenario, $el) {

    var _vm = new ViewModel();

    // bind view model to DOM
    ko.applyBindings(_vm, $el.get(0));

    function ViewModel() {
        var self = this;

        self.checkedConfirm = ko.observable(false);
        self.err = ko.observable(false);
        self.feedback = ko.observable("");

    }

    $el.find('form').submit(function (e) {

        e.preventDefault();

        if (_vm.checkedConfirm()) {

            _vm.err(false);
            _vm.feedback("");
            mgr.show('+1');

        } else {
            _vm.err(true);
            _vm.feedback("Må hakes av for å gå videre")
        }

        return false;
    });

};

// bid.page.SGN_RECEIPT
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.SGN_RECEIPT = function (mgr, scenario, $el) {

    $el.find('form').submit(function (e) {
        e.preventDefault();
        mgr.show('+1');
        return false;
    });

};

// bid.page.SGN_WAIT
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.SGN_WAIT = function (mgr, scenario, $el) {

    var _win,
        _docClientURL = 'bid.html?sid=' + scenario.id + '&doc=1'
        ;

    $el.find('form').submit(function (e) {
        e.preventDefault();

        // TODO: doesn't work in all browsers
            _win.focus();

//        return false;
    });

    function activate() {
        _win = window.self.open(_docClientURL, 'bid_document', 'width=800,height=600,location=0,menubar=0,resizable=1,scrollbars=0,status=0,titlebar=0,dependent=1', false);
        _win.focus();

//        _win.onload = function(){
//            _win.onbeforeunload = function(){
//                mgr.show('+1');
//            }
//            _win.onunload = function(){
//                mgr.show('+1');
//            }
//        };

//        $('body').append('<div style="position: absolute; top:0; left:0; background-color:white;" id="populateme"></div>');
//        $.each(_win, function(key, val){
//            $('#populateme').append('<div>' + key + ' ' +  val + '</div>')
//        });

        var interval = setInterval(function () {
            if (!_win || _win.location == null || _win.closed) {
                clearInterval(interval);
                mgr.show('+1');
            }
        }, 300);

    }

    return {
        activate: activate
    }

};
