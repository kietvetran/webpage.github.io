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
  'maturity'   : {'list':[],'grouped':{}}
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

  _createMaturityList();
  renderApplication( ATTR['main'] );

  ATTR['maturityHolder'] = $('#maturity_table_holder');
  displayMaturityList();
  //verifyMainSidebarToggler();
}

/**
 *
 */
function renderApplication( section ) {
  if ( ! section || ! section.size() ) return;

  $('.sb1_accordion_menu', section).each( function(i,dom) {
    var menu = $(dom);
    if ( menu.hasClass('deposit_account') ) {
      menu.SB1accordionMenu({
        'wizard' : true,
        'next_Click_callback' : function(e) {
          var btn = $(e.currentTarget);
          if ( ! btn.hasClass('action-btn') ) return;
          menu.addClass('process_end')
        }
      });
    }
    else {
      menu.SB1accordionMenu({'wizard' : false });
    }
  }); 

  $('form', section ).each( function(i,dom) {
    var form = $(dom).SB1formValidation({
      'summary_error' : '.error_summary_holder'
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
    //if ( ! node.hasClass('maximum_width') )
    //  node.addClass( (++counter% 2 ? 'row_odd': 'row_even') );
    
    node.SB1formRow({'move':'down'});
    //node.find('.sb1_input_wrapper').SB1radioYesNoButton({});
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
          'defaultLabel': 'Tast inn kontonr eller navn',
          'list' : ACCOUNT,
          'selected' : 'all',
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
          'defaultLabel': 'Tast inn kontonr eller navn',
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
          'shortcut'      : ['month','MONTH+1'],
          //'shortcutSelectedIndex' : 0,
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

function bfClickOnShortcutCallback(e,current,interval) {
  //debug('kiet...');
  //return false;
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

/**
 *
 */
function displayMaturityList() {
  if ( ! ATTR['maturityHolder'] || ! ATTR['maturityHolder'].size() ) return;

  var grouped = ATTR['maturity']['grouped'];
  ATTR['maturityHolder'].find('.maturity_table_wrapper').each( function(i,dom) {
    var wrapper = $(dom), type = wrapper.attr('data-rule');
    var list = type ? (grouped[type] || []) : [], loop = list.length;
    if ( ! loop ) return wrapper.addClass('hide');
    
    var place = wrapper.find('.list_holder');
    if ( ! place.size() ) return wrapper.addClass('hide');
    
    var out = [], sum = 0;
    for ( var i=0; i<loop; i++ ) {
      if ( list[i]['mode'] == 'hide' ) continue;
      var amount = list[i]['amount'] ? parseInt(list[i]['amount']) : 0;
      if ( ! isNaN(amount) ) sum += amount;
      out.push( _getMaturityHTML(list[i]) );
    }

    if ( ! out.length ) { 
      place.html('');
      wrapper.addClass('hide');
    }
    else {
      var footer = wrapper.find('.maturity_table').eq(0).clone()
        .removeAttr('id').attr('class','maturity_table footer');
      footer.children().each( function(j,d){
        var n = $(d);
        if ( ! j ) { 
          n.html('<div class="total_label">Sum</div>');
        } else if ( n.hasClass('amount_number') ) {
          n.html(
            '<div class="label total_label">Sum</div>'+
            '<div class="text amount">'+sum+'</div>'
          );          
        } else { n.html(''); }
      });

      place.html('<ul class="form_row_list"><li>'+out.join('</li><li>')+'</li></ul>'); 
      place.append( footer );
      wrapper.removeClass('hide');
      renderApplication( place );
    }
  });
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


 
    {'type':'class','what':'maturity_tool_link',                       'handler': clickOnMaturityToolLink        },
    {'type':'class','what':'menubar_sub_holder',                       'handler': clickOnMenubaSubHolder         },
    {'type':'id',   'what':'main_navigation_toggler',                  'handler': clickOnMainNavigationToggler   },
    {'type':'id',   'what':'primary_navigation_toggler',               'handler': clickOnPrimaryNavigationToggler},
    {'type':'id',   'what':'main_sidebar_toggler',                     'handler': clickOnMainSidebarToggler      },
    {'type':'class','what':'tg_item',                                  'handler': clickOnTGitem                  },
    {'type':'class','what':'toggle_gadget',                            'handler': clickOnToggleGadget            },
    {'type':'class','what':'maturity_table_expander',   'grand': true, 'handler': clickOnMaturityTableExpander   }
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
function clickOnMaturityToolLink( data ) {
  var current = data['current'], table = current.closest('.maturity_table');
  var parent  = table.parent(), mode = 'show_maturity_description';

  if ( current.hasClass('maturity_edit') ) {
    if ( parent.hasClass('on_edit') ) {
      parent.removeClass( 'on_edit' );
    }
    else {
      var form = parent.closest('.form_row_list');
      form.find('.on_edit').removeClass('on_edit');
      form.find('.'+mode).removeClass( mode );

      parent.addClass( 'on_edit' );
      parent.addClass( mode );
    }
  }
  else if ( current.hasClass('maturity_delete') ) {
  }
  else if ( current.hasClass('maturity_check') ) {
  }
}

/**
 *
 */
function clickOnMaturityTableExpander( data ) {
  var target = data['target'];
  if ( target.is('input') || target.is('a') ) return;
  var current = data['current'], parent = current.parent();
  var mode = 'show_maturity_description', has = parent.hasClass( mode );
  if ( has ) {
    parent.removeClass( mode );
    parent.removeClass( 'on_edit' );
  }
  else {
    var form = parent.closest('.form_row_list');
    form.find('.on_edit').removeClass('on_edit');
    form.find('.'+mode).removeClass( mode );
    parent.addClass( mode );
  }
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
  if ( what == 'new_blue_line_icon' ) {
    var node = $('#layout');
    typeof( force ) == 'boolean' ? (
      force ? node.addClass( what ) : node.removeClass( what )
    ) : node.toggleClass( what );    
    mode = node.hasClass(what), key = 'n_blue_line';
  }
  else if ( what == 'new_main_sidebar' ) {
    var node = $('#layout');
    typeof( force ) == 'boolean' ? (
      force ? node.addClass( what ) : node.removeClass( what )
    ) : node.toggleClass( what );    
    mode = node.hasClass(what), key = 'n_sidebar';
  }
  else if ( what == 'shy_main_sidebar' ) {
    var node = $('#layout');
    typeof( force ) == 'boolean' ? (
      force ? node.addClass( what ) : node.removeClass( what )
    ) : node.toggleClass( what );    
    mode = node.hasClass(what), key = 'sidebar';
  }
  else if ( what == 'small_size' ) {
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

function _getMaturityHTML( data ) {
  var html = '<div class="sb1_form_row maximum_width">'+
      '<div class="sb1_row_content sb1_input_wrapper">'+
        '<ul class="maturity_table maturity_table_expander">'+
          '<li class="expire_date">'+
            '<div class="label">Forfall</div>'+
            '<div class="text">'+data['date']+'</div>'+
            '<div class="input sb1_calender_field_wrapper_">'+
              '<input id="" name="" type="text" required spellcheck="false" autocomplete="off" data-rule="date parent_target[.sb1_calender_field_parent]" class="date_calendar_field" value="'+data['date']+'">'+
            '</div>'+
          '</li>'+
          '<li class="to_account">'+
            '<div class="label">Til</div>'+
            '<div class="name">'+data['toN']+'</div>'+
            '<div class="number">'+data['toA']+'</div>'+
          '</li>'+
          '<li class="from_account">'+
            '<div class="label">Fra</div>'+
            '<div class="text name">'+data['name']+'</div>'+
            '<div class="text number">'+data['id']+'</div>'+
            '<div class="input">'+
              '<div class="sb1_dropdown_menu account_list _stay_open">'+
                '<a role="button" aria-controls="payment_from_account_list" href="#" class="sb1_dropdown_btn"></a>'+
                '<input type="hidden" name="payment_from_account" aria-hidden="true" required data-rule="parent_target[.input] value="'+data['id'].replace(/\s+/g,'')+'">'+
              '</div>'+
            '</div>'+
          '</li>'+
          '<li class="amount_number">'+
            '<div class="label">Beløp</div>'+
            '<div class="text amount">'+data['amount']+',00</div>'+
            '<div class="input">'+
              '<input name="" type="tel" required spellcheck="false" autocomplete="off" data-rule="amount parent_target[.amout]" class="sb1_amount_field" value="'+data['amount']+'">'+
            '</div>'+
          '</li>'+
          '<li class="tool_holder">'+
            '<div class="tool_wrapper">'+
              '<a href="#" class="maturity_tool_link maturity_edit"></a>'+
              '<a href="#" class="maturity_tool_link maturity_delete"></a>'+
              '<a href="#" class="maturity_tool_link maturity_check"></a>'+
            '</div>'+
          '</li>'+
        '</ul>'+
        '<ul class="maturity_table maturity_description">'+
          '<li class="expire_date">'+
            (data['status'] ? '<div class="label">status</div><div>'+data['status']+'</div>' : '')+
          '</li>'+
          '<li class="to_account">'+
            (data['way'] ? '<div class="label">Betalingsmåte</div><div>'+data['way']+'</div>' : '') +
          '</li>'+
          '<li class="from_account">'+
            (data['msg'] ? '<div class="label">Melding/KID</div><div>'+data['msg']+'</div>' : '')+
          '</li>'+
          '<li class="amount_number"></li>'+
          '<li class="tool_holder">'+
            '<div class="input">'+
              (data['type'] == 'stopped' ? '<a href="#" class="maturity_tool_link_text maturity_start_payment">Start betaling</a>' :
                (data['type'] =='approved' ? '<a href="#" class="maturity_tool_link_text maturity_stop_payment">Stop betaling</a>' : '')
              )+
            '</div>'+
            '<div class="input">'+
              '<button class="maturity_table_save action-btn">Lagre</button>'+
            '</div>'+
          '</li>'+
        '</ul>'+
      '</div>'+
    '</div>';
  return html;
}


function _createMaturityList() {
  var list = JSON.parse( JSON.stringify(MATURITY) ); 
  var loop = list.length, i = 0, j = 0, date = null;
  for ( i=0; i<loop; i++ ) {
    date = new Date(), j = getRandom(40,true);
    date.setDate( date.getDate()+j );
    list[i]['date']  = convertDateToText( date );
    list[i]['stamp'] = date.getTime();

    if ( ! ATTR['maturity']['grouped'][list[i]['type']] )
      ATTR['maturity']['grouped'][list[i]['type']] = [];
    ATTR['maturity']['grouped'][list[i]['type']].push( list[i] );
  }  
  i = getRandom( (loop-1), true );
  list[i]['date']  = convertDateToText( ATTR['today'] );
  list[i]['stamp'] = ATTR['today'].getTime();

  ATTR['maturity']['list'] = list;
}




/*
function createAccount() {
}

function createName() {
  var letter = 'qwertyuiopasdfghjklzxcvbnm', s = letter.split('');
  var loop = getRandom( 3 ), list = [];
  for ( var i=0; i<loop; i++ ) {
    
  }
}

function capitaliseFirstLetter( text ){
  return text ? (text.charAt(0).toUpperCase()+text.slice(1).toLowerCase()): '';
}

*/
