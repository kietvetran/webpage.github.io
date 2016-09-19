function startupNNprivate() {
	verifyLogin();
  ATTR['body'].on('click', function() {
    if ( ATTR['body'].hasClass('bankIDdone') ) {
      ATTR['body'].removeClass('bankIDdone');
      loggedInWithBankID();
    }
  });

  $('.sb1_carousel_screen').SB1carousel( {
    //'arrowNavigator'  : false, 
    'scroll'          : true
  });
}

function clickOnCloseLoginWrapper( data ) {
	ATTR['body'].removeClass('display_login_wrapper');	
}

function clickOnLoginBtn( data ) {
	if ( readCookie(ATTR['cookie']+'_login') ) {
		eraseCookie(ATTR['cookie']+'_login');
		verifyLogin();
	}
	else {
		$('#login_wrapper').remove();
		ATTR['body'].append( getLoginWrapperHTML() ).addClass('display_login_wrapper');
	  $('html, body').animate({ 'scrollTop': '0' }, 100, function(){});    
	}
}

function loggedInWithBankID() {
	createCookie(ATTR['cookie']+'_login', '1', 1);
	ATTR['body'].removeClass('display_login_wrapper');
	verifyLogin();
  $('html, body').animate({ 'scrollTop': '0' }, 1, function(){});    
}

function verifyLogin() {
	if ( readCookie(ATTR['cookie']+'_login') ) {
		ATTR['body'].addClass('loggedin');
	}
	else {
		ATTR['body'].removeClass('loggedin');
	}
}

function getLoginWrapperHTML() {
	return '<div class="layout_wrapper" id="login_wrapper">'+
		'<a href="#" class="icon-close close_login_wrapper"><span>Lukk innloggin</span></a>'+
	  '<h2>Logg inn i nettbank privat</h2>'+
	  '<div class="login_content tabwrapper">'+
	    '<ul class="tablist" role="tablist">'+
	      '<li role="presentation">'+
	        '<a id="tab1" href="#" role="tab" aria-controls="panel1" aria-selected="true" class="tab selected">BankID</a>'+
	      '</li>'+
	      '<li role="presentation">'+
	        '<a id="tab2" href="#" role="tab" aria-controls="panel2" aria-selected="false" class="tab">BankID på mobil</a>'+
	      '</li>'+
	    '</ul>'+
	    '<div id="login_panel1" class="panel selected" aria-labelledby="login_tab1" role="tabpanel">'+  
	      '<h3>Nettbank privat</h3>'+
	      '<p class="lead">SpareBank&nbsp;1 Oslo Akershus</p>'+
	      '<div class="bid_wrapper">'+
	        '<iframe frameborder="0" src="./bid/bid.html"></iframe>'+
	      '</div>'+
	      '<ul class="bid_option">'+
          '<li>'+
            '<div>BankID uten Java</div>'+
            '<a href="#">Ofte stilte spørsmål</a>'+
          '</li>'+
          '<li>'+
            '<div>Oppdater din nettleser</div>'+
            '<a href="#">Slik gjør du det</a>'+
          '</li>'+
          '<li>'+
            '<div>Får du BID 2031-melding?</div>'+
            '<a href="#">Her er forslag til løsning</a>'+
          '</li>'+
	      '</ul>'+
	    '</div>'+
	    '<div id="login_panel2" class="panel" aria-labelledby="login_tab2" role="tabpanel">'+    
	    '</div>'+
	  '</div>'+
	  '<div class="login_question">'+
	    '<a href="#" class="secondary-btn arrow-right">Dette lurer andre på</a>'+
	    '<a href="#" class="secondary-btn arrow-right">Få BankID på mobil</a>'+
	 	'</div>'+
	  '<div class="login_contact">'+
	    '<a class="icon-phone" href="tel:0740" >0740</a>'+
	    '<div>Alle dager 07-24</div>'+
	  '</div>'+
	'</div>';
}

function clickOnHamburgerWrapper( data ) {
	var mode = 'display_hamburger_menu';
	if ( ATTR['body'].hasClass(mode) ) {
		ATTR['body'].removeClass(mode)
	}
	else {
		ATTR['body'].addClass(mode);
	}
}

function clickOnPosterOptionBtn( data ) {
	var option = data['current'].closest('.sb1_poster');
	if ( ! option.size() ) return;

	var mode = 'open_option', has = option.hasClass(mode);
	if ( has ) {
		option.removeClass( mode );
	}
	else {
		option.addClass( mode );
	}
}