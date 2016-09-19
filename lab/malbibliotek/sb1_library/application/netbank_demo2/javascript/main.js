/******************************************************************************
=== GLOBAL ATTRIBUTE ===
******************************************************************************/
try { CONFIG;  } catch( error ){ CONFIG  = {};   }
var ATTR = {
  'interval'   : 0,
  'index'      : 0,
  'today'      : new Date(),
  'day'        : 60*60*24*1000,
  'queue'      : [],
  'hashList'   : [],
  'history'    : [],
  'cookie'     : 'sb1_netbank'

};

$( document ).on( 'ready', startup );

/******************************************************************************
=== MAIN GLOBAL FUCNTION ===
******************************************************************************/
/**
 *
 */
function startup() {
  verifyURLoption();

  ATTR['body']   = $( 'body' ); 
  ATTR['main']   = $( 'main' ); 
  ATTR['header'] = $( 'header' ); 
  ATTR['footer'] = $( 'footer' ); 

  $( document ).on('click', clickEvent).on('keyup', keyupEvent );
  $( window )//.on( 'hashchange', hashChangeEvent )
    .on( 'resize', resizeEvent ).on(  'scroll', scrollEvent );

  renderApplication();
}

/**
 *
 */
function renderApplication() {
  $('.sb1_accordion_menu').each( function(i,dom) {
    var menu = $(dom).SB1accordionMenu({
      'wizard' : true,
      'next_Click_callback' : function(e) {
        var btn = $(e.currentTarget);
        if ( ! btn.hasClass('action-btn') ) return;
        menu.addClass('process_end')
      }
    });
  }); 

  $('form').each( function(i,dom) {
    var form = $(dom).SB1formValidation({
      'summary_error' : '.error_summary_holder'
    }).on( 'submit', function( e ) {
      e.preventDefault();
      if ( ! form.hasClass('sb1_form_validation_all_valid') ) return;
    });
  });

  $('.form_row_list > li').each(function(i,dom) {
    var p = null, b = null;
    $('.sb1_form_row:not(.maximum_width)', dom).each(function(j,d) {
      var d = $(d).addClass( j ? 'row_even' : 'row_odd');
      var t = d.find('.sb1_label_wrapper .sb1_info_btn');
      if ( j && (t.size() || b.size()) ) {
        d.addClass('p_bottom');
        p.addClass('p_bottom');        
      }
      p = d; b = t;
    });
  });
  
  $('.sb1_form_row').each(function(i,dom) { 
    var node = $(dom);
    /*
    if ( ! node.hasClass('maximum_width') )
      node.addClass( (++counter% 2 ? 'row_odd': 'row_even') );
    */
    node.SB1formRow({'move':'down'});
    //node.find('.sb1_input_wrapper').SB1radioYesNoButton({});
    node.find('.sb1_dropdown_menu').each( function (i,d) { 
      var menu = $(d);

      if ( menu.hasClass('country_list') ) {
        menu.SB1dropdownMenu({
          'viewCount': 10,
          'searchField' : true,
          'list' : COUNTRY
        }); 
      }
      else if ( menu.hasClass('account_list') ) {
        menu.SB1dropdownMenu({
          'viewCount': 6,
          'searchField' : true,
          'type' : 'account',
          'defaultLabel': 'Tast inn kontonr eller navn',
          'expander' : 'horizontal',
          'list' : ACCOUNT
        });       
      }      
      else { menu.SB1dropdownMenu({}); }  
    });

    var ic = node.find('input.date_calendar_field');
    if ( ic.size() ) {  
      node.SB1calendar({
        //'min'           : (new Date(2014,10,4,0,0,0,0)).getTime(),
        //'max'           : (new Date(2015,5,17,0,0,0,0)).getTime(),
        'display_table' : 1,
        'controller'    : ic.eq(0)
      });
    }
  });  

  //var counter = 0;
}


function reveal() { 
  if ( ATTR['revealed'] ) return;
  ATTR['revealed'] = true;
}

/**
 *
 */
function verifyURLoption( forceDisplay ) {
  var opts = getURLoption();
  changeMainContent('small_size',opts['size'] ? true : false, true );
  if ( opts['display'] )
    changeMainContent(opts['display'],null, true );
  
  //return;
  /*
  var opts = getURLoption(), order = [
    {'what':'filter',    'handler':displayAccordingToFilter             },
    {'what':'category',  'handler':displayAccordingToFilter             },
    //{'what':'visibility','handler': displayAccordingToVisibility },
    {'what':'display',   'handler':displayInformationById, 'delay':true },
    {'what':'search',    'handler':searchAsURLoption                    }    
  ];

  var loop = order.length, tried = false;
  for ( var i=0; i<loop; i++ ) {
    if ( opts[order[i]['what']] ) {
      try {
        order[i]['handler']( 
          opts[order[i]['what']],order[i]['what'], order[i]['delay'] 
        );
        tried = true;
      } catch( error ) {}
    }
  }

  if ( ! tried && forceDisplay ) {
    displaySB1libLibrary( 
      JSON.parse(JSON.stringify(ATTR['reference']['original'])), 
      null, null, true 
    );
  }
  */
}

/******************************************************************************
=== EVENT FUCNTION ===
******************************************************************************/
/**
 *
 */
function scrollEvent( e ) {

}

/**
 *
 */
function keyupEvent( e ) {

}

/**
 *
 */
function resizeEvent( e ) {

}


/**
 *
 */
function clickEvent( e ) {
  if ( ATTR['dragged'] ) return e.preventDefault();
  if ( e['which'] == 3 ) return true;

  var target  = $( e.target ), parent = target.parent();
  var disabled = target.hasClass('disabled') || parent.hasClass('disabled');
    target.hasClass('disabled_link') || parent.hasClass('disabled_link');
  if ( disabled ) {
    e.preventDefault();
    return false;
  }

  var href = target.attr('href') || parent.attr('href') || '';
  if ( href.length > 3 && ! href.match( /^\#/ ) ) return true;
  var order = [
    //{'type':'class','what':'sb1_lib_collection_item', 'grand': true, 'handler': clickOnSB1libCollectionItem    },
    //{'type':'id',   'what':'sb1_lib_login',                          'handler': clickOnSB1libLogin             },
    //{'type':'class','what':'sb1_lib_rating',                         'handler': clickOnSB1libRating            }


    {'type':'class','what':'menubar_sub_holder',                       'handler': clickOnMenubaSubHolder         },
    {'type':'id',   'what':'main_navigation_toggler',                  'handler': clickOnMainNavigationToggler   },
    {'type':'id',   'what':'primary_navigation_toggler',               'handler': clickOnPrimaryNavigationToggler},
    {'type':'id',   'what':'main_sidebar_toggler',                     'handler': clickOnMainSidebarToggler      },
    {'type':'class','what':'tg_item',                                  'handler': clickOnTGitem                  },
    {'type':'class','what':'toggle_gadget',                            'handler': clickOnToggleGadget            }
  ];

  var i = 0, loop = order.length, current = null, trigger = 0, data = null, temp = [];
  for ( i; i<loop; i++ ) {
    var test = order[i]['type'] === 'id' ? (
      target.attr('id')==order[i]['what'] ? 1  : (parent.attr('id')==order[i]['what'] ? 2 : 0) 
    ) : ( 
      target.hasClass(order[i]['what']) ? 1 : (parent.hasClass(order[i]['what']) ? 2 : 0)
    );

    if ( ! test ) { 
      if ( order[i].grand ) {
        var grand = parent.parent(), grandP = grand.parent();
        test = order[i].type === 'id' ? (
          grand.attr('id')==order[i]['what'] ? 1  : (grandP.attr('id')==order[i]['what'] ? 2 : 0) 
        ) : ( 
          grand.hasClass(order[i]['what']) ? 1 : (grandP.hasClass(order[i]['what']) ? 2 : 0)
        );        

        if      ( test == 1 ) target = grand;
        else if ( test == 2 ) parent = grandP;
      }
      if ( ! test ) continue;
    }

    current = test == 1 ? target : parent;

    href = current.attr('href') || target.attr('href') || parent.attr('href') || '';
    if ( href.length < 3 || href.match( /^\#/ ) ) e.preventDefault();   

    //order[i].handler({'target':target,'current':current,'event':e});

    data = {'target':target,'current':current,'event':e};
    trigger = order[i].handler( data );

    if ( trigger === 1 ) ATTR['queue'].push( data ); 
    i = loop;
  }

  while ( ATTR['queue'].length ) {
    data = ATTR['queue'].shift();
    if ( current && trigger !== -1 ) {
      if ( data['current'].attr('id') == current.attr('id') ) {
        temp.push( data );
        continue;
      }
    }

    if ( data['rm'] ) {
      data['current'].removeClass( data['rm'] );
      if ( data['parent'] ) data['parent'].removeClass( data['rm'] );
    }
    if ( data['ad'] ) { 
      data['current'].addClass( data['ad'] );
      if ( data['parent'] ) data['parent'].addClass( data['ad'] );
    }
    if ( typeof(data['callback'])=='function' ) data['callback'](data);
  }

  ATTR['queue'] = temp;
  //updateWindowHistory('search', null );
  return true;
}

/**
 *
 */
function clickOnTGitem( data ) {
  var change = data['current'].attr('data-rule') || '';
  if ( change ) changeMainContent( change );
}

/**
 *
 */
function clickOnToggleGadget( data ){
  $('#layout').toggleClass('hide_tool_gadget');
}

/**
 *
 */
function clickOnMenubaSubHolder( data ) {
  var current = data['current'], parent = current.closest('ul');
  var mode = 'open_menu', has = current.hasClass( mode );

  parent.find('.'+mode).removeClass( mode );
  if ( ! has ) current.addClass( mode );
}

/**
 *
 */
function clickOnMainNavigationToggler( data ) {
  var current = data['current'], mode = 'display_main_navigator';
  var node    = current.parent().find('.menubar');
  var duration = getDuration( node );

  ATTR['body'].toggleClass( mode ).addClass( mode+'_on_animation');
  setTimeout( function() { 
    ATTR['body'].removeClass( mode+'_on_animation');
  }, duration );  
}

/**
 *
 */
function clickOnPrimaryNavigationToggler( data ) {
  var current = data['current'], mode = 'display_primary_navigator';
  var node    = current.parent().find('.menutab');
  var duration = getDuration( node );

  ATTR['body'].toggleClass( mode ).addClass( mode+'_on_animation');
  setTimeout( function() { 
    ATTR['body'].removeClass( mode+'_on_animation');
  }, duration );  
}

/**
 *
 */
function clickOnMainSidebarToggler( data ) {
  var current = data['current'], mode = 'display_main_sidebar';
  var sidebar = current.closest('.separation_sidebar');
  var duration = getDuration( sidebar );

  ATTR['body'].toggleClass( mode ).addClass( mode+'_on_animation');
  setTimeout( function() { 
    ATTR['body'].removeClass( mode+'_on_animation');
  }, duration );
}

/**
 *
 */
function changeMainContent( what, force, startup ) {
  var key = '', mode = true;
  if ( what == 'small_size' ) {
    var node = $('#layout');
    typeof( force ) == 'boolean' ? (
      force ? node.addClass('force') : node.removeClass('force')
    ) : node.toggleClass( 'force' );
    mode = node.hasClass('force'), key = 'size';
  }
  else {
    var section = $('#main .separation_content section');
    var one = section.filter('#'+what );
    if ( ! one.size() ) return;
    section.hide(), one.show();
    $('#tool_gadget').removeAttr('class').addClass('display_'+what);
    key = 'display';
  }
  if ( ! startup && key ) { 
    updateWindowHistory(key, mode ? what : null);
    //ATTR.notVerifyURL = true;
    //setTimeout( function() { ATTR.notVerifyURL = null; }, 400 );
    //clearTimeout(ATTR['hashTimer'])
    //setTimeout( function() { clearTimeout(ATTR['hashTimer'] || 0); }, 100 );
  }
}

/**
 *
 */
function hashChangeEvent( e ) {
  if ( ATTR['hashTimer'] ) clearTimeout(ATTR['hashTimer']);
  ATTR['hashTimer'] = setTimeout( function() {
    if ( ! ATTR.notVerifyURL ) verifyURLoption( true );
  }, 500 );
}


/**
* The function
* @return {Void}
*/
function setupIframe( iframe ) {
  if ( ! iframe ) return;

  var node = $( iframe ), id = generateId( node ), timer = 0;
  setTimeout( function() { setIframeHeight( iframe ); }, 100 );

  if ( ! ATTR['iframeHolder'] ) ATTR['iframeHolder'] = [];
  ATTR['iframeHolder'].push( id );
}

/**
 *
 */
function setIframeHeight( iframe, resize ) {
  var doc = iframe.contentDocument ? 
    iframe.contentDocument : iframe.contentWindow.document;
  if ( ! doc ) return;

  if ( resize ) iframe.style.height = 'auto';

  var height = 0, min = 40, iWin = 
    iframe.contentWindow || iframe.contentDocument.parentWindow;
  if ( iWin.document.body )
    height = iWin.document.documentElement.scrollHeight || iWin.document.body.scrollHeight;

  if ( ! height ) {
    var body = doc.body, html = doc.documentElement;
    height = body && html ? Math.max( 
      body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight 
    ) : 0;
  }
  
  if ( ! height || isNaN(height) || height < min ) height = min;
  if ( resize ) height += 10;
  iframe.style.height = (height+5)+'px';
}

/**
 *
 */
function getIframeBodyText( iframe ) {
  if ( ! iframe ) return '';

  var doc = iframe.contentDocument ? 
    iframe.contentDocument : iframe.contentWindow.document;
  if ( ! doc ) return '';

  var iWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
  var body = iWin.document.body  || doc.body;
  return body ? (body.innerHTML || '') : '';
}

/**
 *
 */
function setIframeBodyText( iframe, text ) {
  if ( ! iframe ) return '';

  var doc = iframe.contentDocument ? 
    iframe.contentDocument : iframe.contentWindow.document;
  if ( ! doc ) return '';

  var iWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
  var body = iWin.document.body  || doc.body;
  if ( body ) body.innerHTML = text || '';
}

/**
 *
 */
function updateWindowHistory( key, text ) {
  clearTimeout( ATTR['historyTimer'] || 0 );
  if ( ! ATTR['history'] ) ATTR['history'] = [];
  ATTR['history'].push({'k':key,'t':text});
  ATTR['historyTimer'] = setTimeout( function() {
    var opts = getURLoption(), loop = ATTR['history'].length;
    var out = [], pin = {};
    for ( var i=0; i<loop; i++ ) {
      var data = ATTR['history'][i];
      opts[data['k']] = data['t'] || null;
    }
    
    for ( var k in opts ) {
      if ( k !='pathname' && opts[k] ) out.push( k+'='+opts[k] );
    }
    window.location.hash = '?'+out.join('&');
    ATTR['history'] = [];
  }, 200 );
}

/**
 */
function getDuration( node ){
  var v = node && node.size() ? 
    (node.css('transition-duration') || 0) : 0;
  if ( v ) v = parseFloat( v ) * 1000;
  return isNaN(v) ? 0 : v;
}

/**
 *
 */
function _getSpinnerHTML() {
  return '<span class="sb1_spinner">'+
    '<i class="spinner_rect1"></i>'+
    '<i class="spinner_rect2"></i>'+
    '<i class="spinner_rect3"></i>'+
    '<i class="spinner_rect4"></i>'+
    '<i class="spinner_rect5"></i>'+
  '</span>';
}