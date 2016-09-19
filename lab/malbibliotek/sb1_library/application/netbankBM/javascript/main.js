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
  'cookie'     : 'sb1_netbank',
  'movement'   : {'list':[],'path':{},'grouped':{},'interval':null, 'account':null,'sort':{}},
  'maturity'   : {'list':[],'path':{},'grouped':{},'interval':null, 'account':null,'sort':{}}
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
  ATTR['main']   = $( '#main_content' ); 
  ATTR['header'] = $( '#topnavigation' ); 
  ATTR['footer'] = $( '#copyright_footer' ); 

  $( document ).on('click', clickEvent).on('keyup', keyupEvent );
 $( document ).on("touchstart touchend touchmove mousedown mouseup mousemove", function(e){
    touchEventHandler( e, touchEvent );
  });
  $( window )//.on( 'hashchange', hashChangeEvent )
    .on( 'resize', resizeEvent ).on(  'scroll', scrollEvent );

  renderApplication( ATTR['main'] );

  ATTR.body.on("dragstart", "a", function () { return false; });
  resizeSCsize( true );
  //resizeSCsize( );
  //verifyMainSidebarToggler();
}

/**
 *
 */
function renderApplication( section, recall ) {
  if ( ! section || ! section.size() ) return;

  $('.sb1_accordion_menu', section).each( function(i,dom) {
    var menu = $(dom);
    if ( menu.hasClass('deposit_account') ) {
      menu.SB1accordionMenu({
        'wizard' : true,
        'nextClickCallback' : function(e) {
          var btn = $(e.currentTarget);
          if ( ! btn.hasClass('action-btn') ) return;
          menu.addClass('process_end');
        }
      });
    }
    else {
      menu.SB1accordionMenu({'wizard' : false });
    }
  }); 

  $('form', section ).each( function(i,dom) {
    var form = $(dom).SB1formValidation({
      'summary_error' : '.error_summary_holder',
      'beforeValidationCallback': beforeValidationCallback,
      'afterValidationCallback' : recall ? recall['afterValidationCallback'] : null,
      'submitCallback' : recall ? recall['submitCallback'] : null
    }).on( 'submit', function( e ) {
      e.preventDefault();
      if ( ! form.hasClass('sb1_form_validation_all_valid') ) return;
    });
  });

  $('.form_row_list > li', section ).each(function(i,dom) {
    var p = null, b = null;
    $('> .sb1_form_row:not(.maximum_width)', dom).each(function(j,d) {
      d = $(d).addClass( j ? 'row_even' : 'row_odd');
      var t = d.find('.sb1_label_wrapper .sb1_info_btn');
      if ( j && (t.size() || b.size()) ) {
        d.addClass('p_bottom');
        p.addClass('p_bottom');        
      }
      d.find('>.sb1_form_row').each( function(x,y){
        $(y).addClass( x ? 'row_even' : 'row_odd');
      });

      p = d; b = t;
    });
  });

  $('.sb1_form_row', section).each(function(i,dom) { 
    var node = $(dom);
 
    node.SB1formRow({'move':'down'});

    node.find('.sb1_dropdown_menu').each( function (i,d) { 
      var menu = $(d), multiple = menu.hasClass('multiple_selection');

      if ( menu.hasClass('country_list') ) {
        menu.SB1dropdownMenu({
          'viewCount': 10,
          'searchField' : true,
          'list' : COUNTRY
        }); 
      }
      else if  ( multiple ) {
        menu.SB1dropdownMenu({
          'searchField' : true,
          'scrollable': true,
          'type' : 'account',
          'defaultLabel': menu.attr('data-label') || 'Tast inn kontonr eller navn',
          'list' : ACCOUNT,
          'selected' : 'all',
          'afUpdateSelectedCallback' : afUpdateSelectedCallback,
          //'toolWrapper' : $('#maturity_dd_tool_holder'),
          'multiple': multiple,
          'multipleLabel' : multiple ? {
            'all'  : 'All kontoer ('+ACCOUNT.length+')',
            'of'   : 'av',
            'unit' : 'konto',
            'units': 'kontoer'
          } : null          
        });       
      }
      else if ( menu.hasClass('account_list') ) {
        menu.SB1dropdownMenu({
          'viewCount': 6,
          'searchField' : true,
          'type' : 'account',
          'defaultLabel': menu.attr('data-label') || 'Tast inn kontonr eller navn',
          'expander' : 'horizontal',
          'list' : ACCOUNT,
          'multiple': multiple,
          'multipleLabel' : multiple ? {
            'all'  : 'All kontoer ('+ACCOUNT.length+')',
            'of'   : 'av',
            'unit' : 'konto',
            'units': 'kontoer'
          } : null          
        });       
      }      
      else { menu.SB1dropdownMenu({}); }  
    });
  

    var ic = node.find('input.date_calendar_field');
    if ( ic.size() ) {  
      if ( ic.hasClass('maturity') ) {
        var SCholder = node.parent().find('.shortcut_holder');
        node.SB1calendar({
          'min'           : 'today',
          //'max'           : (new Date(2015,5,17,0,0,0,0)).getTime(),
          'controller'    : ic,
          'shortcutWrapper' : SCholder.size() ? SCholder : null,
          //'shortcut'      : ['month','month+1','month+3'], 
          //'shortcut'      : ['day+30','day+60','day+90'],
          //'shortcut'      : ['day+30','month','month+1'],
          'shortcut'      : ['month','MONTH+1',{'type':'all_maturity_shortcut_btn','label':'Alle'}],
          'shortcutSelectedIndex' : 0,
          'bfClickOnShortcutCallback' : bfClickOnShortcutCallback       
        });
      }
      else {
        node.SB1calendar({
          'min'           : (new Date()).getTime(),
          //'max'           : (new Date(2015,5,17,0,0,0,0)).getTime(),
          'display_table' : 1,
          'controller'    : ic.eq(0)
        });
      }
    }
  });
}

function beforeValidationCallback( current ) {
  var id = current ? current.attr('id') : '';
  if( id=='account_movement_free_text' || id=="sb1_input_placeholder" )
    return false;
  return true;
}

function afUpdateSelectedCallback( data ) {
  var value = data['value'];
  if ( value === null || typeof(value)=='undefined' ) {
    var main = data['main'] || (data['item'] ? 
      data['item'].closest('.sb1_dropdown_menu') : null
    );
    var input = main ? main.find('>input') : null;
    if ( ! input || ! input.size() ) { return; }
    value = input.val();
  }

  var list = (value || '').split(';'), loop = list.length;
  if ( loop ) {
    ATTR['maturity']['account'] = {};
    for ( var i=0; i<loop; i++ ) { ATTR['maturity']['account'][list[i]] = 1;}
  } else { ATTR['maturity']['account'] = null; }
  filterMaturityList();
}

function bfClickOnShortcutCallback( data ) {
  ATTR['maturity']['interval'] = data['interval'];
  var mode = 'active', parent = data['current'].parent();
  parent.children().removeClass( mode );
  data['current'].addClass( mode );

  filterMaturityList();
  return false;
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
  changeMainContent('shy_main_sidebar',opts['sidebar'] ? true : false, true );
  changeMainContent('new_main_sidebar',opts['n_sidebar'] ? true : false, true );
  changeMainContent('new_blue_line_icon',opts['n_blue_line'] ? true : false, true );
  changeMainContent('maturity_hide_A_N',opts['maturity_hide_A_N'] ? true : false, true );
  changeMainContent('maturity_add_L_N',opts['maturity_add_L_N'] ? true : false, true );
  changeMainContent('maturity_small_T',opts['maturity_small_T'] ? true : false, true );

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
  verifyMainSidebarToggler();
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
  resizeSCsize(e);
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
    {'type':'class','what':'tab_item',                  'grand': true, 'handler': clickOnTabItem                 },
    {'type':'class','what':'contact_info_expander',                    'handler': clickOnContactInfoExpander     },
    {'type':'class','what':'leftColumnExpander',                       'handler': clickOnLeftColumnExpander      },
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
function clickOnTabItem( data ) {
  var mode = 'selected';
  if ( data['current'].hasClass(mode) ) return;

  var list  = data['current'].closest('.tab_list');
  var tab   = list.find('.tab_item');
  tab.removeClass( mode ).each( function(i,dom){
    $(dom).attr('aria-selected','false');
  }); 
  data['current'].addClass( mode ).attr('aria-selected','true');

  var index = tab.index( data['current'] );
  var panel = list.parent().find('> .panel_item');
  if ( ! panel.size() ) panel = list.parent().parent().find('> .panel_item');

  panel.removeClass( mode ).each(function(i,dom){
    $(dom).attr('aria-hidden','true');
  }).eq( index ).addClass( mode ).attr('aria-hidden','false');
}

/**
 *
 */
function clickOnMovementToggler(data) {
  var target = data['current'].closest('.movement_table_expander');
  clickOnMovementTableExpander({'current':target});
}

/**
 *
 */
function clickOnAccountMovementSearchBtn( data ) {
  var text   = ATTR['movementTextField'].val() || '';
  var amount = ATTR['movementAmountField'].val() || '';

  if ( amount ) amount = parseFloat(amount.replace(/[\-\s]+/,''));

  var reg  = text ? createRegExp(text,true,true) : null;
  var list = ATTR['movement']['list'], loop = list.length;
  for ( var i=0; i<loop; i++ ) {
    var mode = '';
    if ( reg ) {
      if ( ! list[i]['msg'] || ! list[i]['msg'].match(reg) ) 
        mode = 'hide';
    }

    if ( ! mode && amount ) {
      var t = list[i]['amount'] ? 
        parseFloat(list[i]['amount'].replace(/[\-\s]+/,'')) : null;
      if ( ! t || t != amount ) mode = 'hide'; 
    }
    list[i]['mode'] = mode;
  }

  displayMovementList();
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
function clickOnContactInfoExpander( data ) {
  var mode = 'display_contact_info';
  ATTR['body'].toggleClass( mode );
}

/**
 *
 */
function clickOnLeftColumnExpander( data ) {
  var current = data['current'], mode = 'display_main_sidebar';
  var node    = current.parent();
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
function verifyMainSidebarToggler() {
  var sidebar = $('#main_sidebar_toggler'), span = sidebar.children().eq(0);
  if ( ! span.size() ) return;
  var scrolled = getScrollPosition(), top = sidebar.offset().top;
  if ( scrolled[1] < top ) return span.removeAttr('style');

  var difference = scrolled[1]-top;
  span.css({'margin-top': difference+'px'});
} 

/**
 *
 */
function changeMainContent( what, force, startup ) {
  var key = '', mode = true;
  if ( 
    what=='new_blue_line_icon' || what=='new_main_sidebar' || 
    what=='shy_main_sidebar'   || what=='small_size' || 
    what=='maturity_hide_A_N'  || what=='maturity_add_L_N' || what=='maturity_small_T' 

  ) {
    var node = $('#layout'), type = what == 'small_size' ? 'force': what;
    typeof( force ) == 'boolean' ? (
      force ? node.addClass( type ) : node.removeClass( type )
    ) : node.toggleClass( type );    

    mode = node.hasClass( type ); 
    key  = what == 'new_blue_line_icon' ? 'n_blue_line' : (
      what == 'new_main_sidebar' ? 'n_sidebar' : (
        what=='small_size' ? 'size': (what=='shy_main_sidebar' ? 'sidebar' : what)
      )
    );
  }
  else if ( what =='maturity_hide_account_number') {

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
