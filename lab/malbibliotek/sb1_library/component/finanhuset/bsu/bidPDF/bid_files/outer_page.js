//	_______________________________________________
//	outer_page.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
/*
    This class handles the outer page elements; the header and footer.
    It has only responsibilites related to those elements and listens
    for user interaction on GUI elements within the header and footer.
    If any such interaction affects the page(s) it broadcasts the event
    to the mediator so that it can deal with the event appropriatly.
    As such this class has no affiliation with the pages (page.js).

    Note: this class has the responsibility of showing sertificates
    and metapages (about BankID, privacy, and sertificates) and
    popovers (last use and last failed use).
*/
bid.OuterPage = function($el, scenario, eventHandlers, $mediator){

    var self = {
            handleNewPage: handleNewPage
        },

    // a shortcut reference
        bps = bid.page.step,

    // View model
        _vm = new ViewModel()
        ;

    $el.each(function(key, val){
        ko.applyBindings(_vm, val);
    });

    var $btnMenu = $el.find('#btn_menu'),
        $btnLast = $el.find('#btn_last_success'),
        $btnFail = $el.find('#btn_last_failed'),
        $btnSert = $el.find('#btn_sertificate')
        ;

    var that = self;

    function ViewModel(){
        // reference to this (view model)
        var self = this;

        self.sertificates = ko.observableArray();
        self.sertificate = ko.observable({});

        self.sertificateType = ko.computed(function(){
            switch(self.sertificate().type) {
                case 'personal':
                    return 'Personsertifikat'
                case 'merchant':
                    return 'Godkjent BankID brukersted';
            }
        });

        self.page = ko.observable(bps.DEFAULT);
        self.show_fail = ko.observable(Boolean(scenario.used.fail));
        self.show_last = ko.observable(Boolean(scenario.used.last));

        // Zoom tolls panel handeler
        self.zoom = bid.zoom;

        if (scenario.documentSource)
            self.pageselector = new pageSelectorViewModel();

        self.enable_button = ko.observable(false);

        self.show_button = ko.computed(function(){
            switch(self.page()){
                case bps.PWD:
                    return true;
                    break;
                case bps.PID:
                case bps.OTP:
                default:
                    return false;
                    break;
            }
        });

        self.heading = ko.computed(function(){
            return scenario.type;
//            if (self.page())
//                return self.page().type;
//            else
//                return '';
        });

        self.used = ko.observable(scenario.used);

        // broadcast message of click on back button
        self.btnBackClicked = function(obj, e){
            $mediator.trigger(bid.e.GOTO_PREVIOUS_PAGE);
        };

        // broadcast message of click on proceed button
        self.btnProceedClicked = function(obj, e){
            $mediator.trigger(bid.e.GOTO_NEXT_PAGE);
        };

        // button click handlers that
        // displays related popovers
        self.btnMenuClicked = function(obj, e){
            var obj = {
                $el: $btnMenu,
                tmpl: 'tmpl_menu',
                vm: self,
                id: 'pop_menu',
                css: {
                    top:'3.8em',
                    left:'center'
                },
                cssArr: {
                    left: '50%'
                }
            };
            new bid.Popover(obj);
        }
        self.btnLastClicked = function(obj, e){
            var obj = {
                $el: $btnLast,
                tmpl: 'tmpl_last',
                vm: scenario.used.last,
                id: 'pop_last',
                css: {
                    bottom:'3.9em',
                    right:0,
                    width:'100%'
                },
                cssArr: {
                    right: '2.5em'
                }
            };
            new bid.Popover(obj);
        }
        self.btnFailClicked = function(obj, e){
            var obj = {
                $el: $btnFail,
                tmpl: 'tmpl_fail',
                vm: scenario.used.fail,
                id: 'pop_fail',
                css: {
                    bottom:'3.9em',
                    right:0,
                    width:'100%'
                },
                cssArr: {
                    right: '5.8em'
                }
            };
            new bid.Popover(obj);
        }
        self.btnSertClicked = function(obj, e){
            var obj = {
                $el: $btnSert,
                tmpl: 'tmpl_sert',
                vm: self,
                id: 'pop_sert',
                css: {
                    bottom:'4.1em',
                    left:'.7em'
                },
                cssArr: {
                    left: '1.75em'
                }
            };
            new bid.Popover(obj);
        }

        // popover links that trigger
        // mediator event handlers that displays overlay pages
        self.linkSertificateClicked = function(obj, e){
            eventHandlers.showSertificate();
        }
        self.linkPrivacyClicked = function(obj, e){
            eventHandlers.showPrivacy();
        }
        self.linkAboutClicked = function(obj, e){
            eventHandlers.showAbout();
        }

        self.linkLogoClicked = function(obj, e){
            bid.app.location('index.html');
        }

    };

    function pageSelectorViewModel(){
        var self = this;
        self.next = function(){ self.current(self.current()+1); $mediator.trigger(bid.e.GOTO_NEXT_SUB_PAGE, self.current()) };
        self.prev = function(){ self.current(self.current()-1); $mediator.trigger(bid.e.GOTO_PREVIOUS_SUB_PAGE, self.current()) };
        self.current = ko.observable(0);
        self.total = ko.observable(scenario.documentSource.length);
        self.currentStr = ko.computed(function(){
            return self.current() + 1;
        })
    }


    // a new page is activated and ready
    function handleNewPage(e, obj){
        if (e.type == bid.e.NEW_PAGE_START) {

            // sertificates
            switch(obj.page){

                case bps.PWD:
                case bps.CHG_INFO:
                case bps.CHG_PWD:
                case bps.CHG_CONFIRMATION:
                case bps.SGN_RECEIPT:
                    _vm.sertificates([scenario.sert.merchant, scenario.sert.personal])
                    _vm.sertificate(scenario.sert.personal);
                    break;

                default:
                    _vm.sertificates([scenario.sert.merchant]);
                    _vm.sertificate(scenario.sert.merchant);
                    break;
            }

            _vm.page(obj.page);
        }

        if(e.type == bid.e.NEW_PAGE_END) {
            switch(obj.page){
                case bps.PWD:
                    // is there a last-used-failed case?
                    if (scenario.used.fail)
                    // then display the alert
                        _vm.btnFailClicked();
                    break;
            }
        }
    }

    return self;
}
