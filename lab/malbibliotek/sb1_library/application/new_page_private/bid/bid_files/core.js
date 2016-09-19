//	_______________________________________________
//	core.js
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// This script is shared among all the HTML-files constituting the BankID 2.0 application and as such it contains
// several variables and methods that is used across the application.

// namespace (for both classes and instanciated objects)
var bid = bid
	? bid 
	: {
		app: {
			name: 'BankID nextgen',
			version: '0.5b'
		},
		otp: {},
		page: {},
		password: {},
		scenario: {},
		template: {}
	};

// courtesy of Paul Irish
// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    if(this.console){
        console.log( Array.prototype.slice.call(arguments) );
    }
};

bid.app.toString = function(){
	return bid.app.name + ' v.' + bid.app.version;
};

// A simple method for changing the top frame's address.
bid.app.location = function(file, params){
	if (!params){
		top.location.href = file;
		return;
	}

	var arr = $.map(params, function(val, key){
		return key + '=' + val;
	});

	top.location.href = file + '?' + arr.join('&');
};

// event listener string name (different from IE and other browsers)
bid.addEventListener = window.addEventListener ? 'addEventListener' : 'attachEvent';

// post message domain
bid.domain = location.host ? 'http://' + location.host : '*';


//	bid.pm
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// post message events (constants)
bid.pm = {
	BID_CLIENT_READY: 		'bid_client_ready',
	BID_CLIENT_CANCEL: 		'bid_client_cancel',
	BID_CLIENT_SUCCESS: 	'bid_client_success',
	SCENARIO_RUN: 			'scenario_run',
	PAGE_LOADED: 			'page_loaded',
    PAGE_RESIZED:           'page_resized',
	MESSAGE: 				window.addEventListener ? 'message' : 'onmessage',
    TAB_CLOSED:             'tab_closed'
};


//	bid.page.title
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
bid.page.title = {
	IDENTIFICATION: 	    'Identifisering',
	CHANGE_PASSWORD: 	    'Endre passord',
	PRIVACY: 		    	'Personvern',
	SERTIFICATE: 		    'BankID Sertifikater',
    SIGNING:                'Signering'
};

//	bid.page.step
//	‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// 	scenario page step configurations
bid.page.step = {

    DEFAULT: {
        type: null,
        tmpl: null
    },
    // personal identification
    PID: {
        type: bid.page.title.IDENTIFICATION,
        tmpl: 'tmpl_pid'
    },
    // one time password
    OTP: {
        type: bid.page.title.IDENTIFICATION,
        tmpl: 'tmpl_otp'
    },
    // password
    PWD: {
        type: bid.page.title.IDENTIFICATION,
        tmpl: 'tmpl_pwd'
    },
    // change password info page
    CHG_INFO: {
        type: bid.page.title.CHANGE_PASSWORD,
        tmpl: 'tmpl_chg_info'
    },
    // change password
    CHG_PWD: {
        type: bid.page.title.CHANGE_PASSWORD,
        tmpl: 'tmpl_chg_pwd'
    },
    // change password confirmation
    CHG_CONFIRMATION: {
        type: bid.page.title.CHANGE_PASSWORD,
        tmpl: 'tmpl_chg_confirm'
    },
    // privacy (personvern)
    PRI: {
        type: bid.page.title.PRIVACY,
        tmpl: null
    },
    // sertificate
    SRT: {
        type: bid.page.title.SERTIFICATE,
        tmpl: null
    },
    SUC: {
        type: 'Success',
        tmpl: 'tmpl_success'
    },
    SGN_INTRO: {
        type: bid.page.title.SIGNING,
        tmpl: 'tmpl_sgn_intro'
    },
    SGN_DOCUMENT: {
        type: bid.page.title.SIGNING,
        tmpl: 'tmpl_sgn_document',
        header: {
            fullBorderWidth: true,
            bidLogo: false,
            btnBack: true,
            btnClose: false,
            btnProceed: true
        },
        footer: {
            fullBorderWidth: true,
            zoomTool: true,
            sertificate: false,
            pageSelector: true
        }
    },
    SGN_DOCUMENT_TXT: {
        type: bid.page.title.SIGNING,
        tmpl: 'tmpl_sgn_document',
        header: {
            fullBorderWidth: true,
            bidLogo: false,
            btnBack: true,
            btnClose: false,
            btnProceed: true
        },
        footer: {
            fullBorderWidth: true,
            display: false
        }
    },
    SGN_WAIT: {
        type: bid.page.title.SIGNING,
        tmpl: 'tmpl_waiting',
        tab: true
    },
    SGN_DOCUMENT_HTML: {
        type: bid.page.title.SIGNING,
        tmpl: 'tmpl_sgn_document',
        header: {
            fullBorderWidth: true,
            bidLogo: false,
            btnBack: true,
            btnClose: false,
            btnProceed: true
        },
        footer: {
            fullBorderWidth: true,
            display: false
        }
    },
    SGN_CONFIRM: {
        type: bid.page.title.SIGNING,
        tmpl: 'tmpl_sgn_confirm',
        header: {
            bidLogo: false,
            btnBack: true
        }
    },
    SGN_RECEIPT: {
        type: bid.page.title.SIGNING,
        tmpl: 'tmpl_sgn_receipt',
        header: {
            btnClose: false
        }
    }

};

// apply default attributes to each step
(function(){

    // template
    var step = {
        header: {
            display:true,
            fullBorderWidth: false,
            bidLogo: true,
            btnBack: false,
            btnClose: true,
            btnProceed: false
        },
        footer: {
            display:true,
            fullBorderWidth: false,
            zoomTool: false,
            sertificate: true,
            pageSelector: false
        }
    };

    // map bid.page.step
    bid.page.step = $.each(bid.page.step, function(key, val){
        bid.page.step[key] = $.extend(true, {}, step, val);
    });

}());

/*
NOT IN USE
// A simple iterator taking an array as parameter.
// Any attempt to iterate out of bounds will produce an exception.
bid.Iterator = function(arr) {

    var index;

    function current(){
        if (index === undefined)
            index = 0;

        return arr[index];
    }

    function next(){

        // increment index
        index = index === undefined
            ? 0
            : ++index
        ;

        // out of bounds?
        if (!hasNext())
            throw 'No more elements in array.';

        return arr[index];
    }

    function prev(){

        // increment index
        index = index === undefined || index <= 0
            ? 0
            : index--
        ;

        return arr[index];
    }

    function hasNext(){
        return index < arr.length;
    }

    function hasPrev(){
        return index < arr.length;
    }

    function currentIndex(){
        return index;
    }

    return {
        current: current,
        next: next,
        hasNext: hasNext,
        index: currentIndex
    }

};
*/

bid.vendorPrefix = (function vendor(){

    var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
    var someScript = document.getElementsByTagName('script')[0];

    for(var prop in someScript.style){
        if(regex.test(prop)){
            return prop.match(regex)[0];
        }
    }

    if('WebkitOpacity' in someScript.style) return 'Webkit';
    if('KhtmlOpacity' in someScript.style) return 'Khtml';

    return '';
}());

/*
NOT IN USE
// Returns an array of values based on key-parameter.
// param key:string 	the key to extract from the get-string paramters
function querystring(key) {
    var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
    var r=[], m;
    while ((m=re.exec(document.location.search)) != null) r[r.length]=m[1];
    return r;
}
*/


// Returns a value based on a GET-parameter.
// Ie. if running
//      getURLParameter("sid")
// for this URL:
//      http://localhost/index_tmpl.html?sid=UC1&action=run
// will return
//      "UC1"
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
}

// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
function getInternetExplorerVersion() {

    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;

}
