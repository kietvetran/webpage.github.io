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
  ATTR['body']   = $( 'body' ); 
  ATTR['main']   = $( 'main' ); 
  ATTR['header'] = $( 'header' ); 
  ATTR['footer'] = $( 'footer' ); 

  verifyURLoption('','payment','register_payment_section');

  $( document ).on('click', clickEvent).on('keyup', keyupEvent );
  $( window )//.on( 'hashchange', hashChangeEvent )
    .on( 'resize', resizeEvent ).on(  'scroll', scrollEvent );

  _createMaturityList();
  _createMovementList();
  renderApplication( ATTR['main'] );

  ATTR['maturityHolder'] = $('#maturity_table_holder');
  ATTR['movementHolder'] = $('#movement_table_holder');
  displayMovementList();

  ATTR['movementTextField']   = $('#account_movement_free_text');
  ATTR['movementAmountField'] = $('#account_movement_amount');

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
          'defaultLabel': 'Tast inn kontonr eller navn',
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
function verifyURLoption( forceDisplay, defaultCategory, defaultPage ) {
  var opts = getURLoption();

  if ( ! opts['display'] && ! opts['category'] ) 
    opts['display'] = defaultPage || '';

  if ( ! opts['category'] ) 
    opts['category'] = defaultCategory || '';

  changeMainContent('small_size',opts['size'] ? true : false, true, opts['category'], opts['style'] );
  changeMainContent('shy_main_sidebar',opts['sidebar'] ? true : false, true, opts['category'], opts['style'] );
  changeMainContent('new_main_sidebar',opts['n_sidebar'] ? true : false, true, opts['category'], opts['style'] );
  changeMainContent('new_blue_line_icon',opts['n_blue_line'] ? true : false, true, opts['category'], opts['style'] );
  changeMainContent('merging_blue_line_icon',opts['m_blue_line'] ? true : false, true, opts['category'], opts['style'] );
  changeMainContent('expanding_blue_line_icon',opts['e_blue_line'] ? true : false, true, opts['category'], opts['style'] );  
  changeMainContent('new_top_banner',opts['n_top_banner'] ? true : false, true, opts['category'], opts['style'] );
  changeMainContent('maturity_hide_A_N',opts['maturity_hide_A_N'] ? true : false, true, opts['category'], opts['style'] );
  changeMainContent('maturity_add_L_N',opts['maturity_add_L_N'] ? true : false, true, opts['category'], opts['style'] );
  changeMainContent('maturity_small_T',opts['maturity_small_T'] ? true : false, true, opts['category'], opts['style'] );

  if ( opts['display'] ) {
    changeMainContent(opts['display'],null, true, opts['category'], opts['style'] );
  }
}

function filterMaturityList() {
  clearTimeout( ATTR['maturity']['filterTimer'] || 0 );
  ATTR['maturity']['filterTimer'] = setTimeout( function() {
    var interval = ATTR['maturity']['interval'];
    var account  = ATTR['maturity']['account'];
    var list = ATTR['maturity']['list'], loop = list.length;
    for ( var i=0; i<loop; i++ ) {
      if ( list[i]['mode']=='deleted' ) continue;

      var mode = '', stamp = list[i]['stamp'], from = list[i]['from'];
      if ( interval ) {
        if ( stamp<interval[0] || stamp>(interval[1]+ATTR['day']) ) mode = 'hide';
      }

      if ( ! mode && account ) {
        if ( ! account[from.replace(/\s+/g,'')] ) mode = 'hide';
      }
      list[i]['mode'] = mode;
    }
    displayMaturityList();
  }, 100 );
}

function _getSortedMaturityList( type ) {
  var list = type ? (ATTR['maturity']['grouped'][type] || []) : [];
  var slc  = '.maturity_table_'+type+' .maturity_table.header .on_sort';
  var item = ATTR['maturityHolder'].find( slc );

  var key  = item.attr('data-rule'), dec = item.hasClass('decreasing');
  //var what = ATTR['maturity']['sort'][type] || 'stamp';
  //var dec  = what.match( /^\_/i ) ? true : false, key = what.replace( /^\_/g, '');


  var sorted = list.sort( function(a,b){
    if ( typeof(a) != 'object' ) a = ATTR['maturity']['path'][a] || {};
    if ( typeof(b) != 'object' ) b = ATTR['maturity']['path'][b] || {};

    var x = a[key], y = b[key];
    var r = ((x < y) ? -1 : ((x > y) ? 1 : 0)); 
    return r == 0 || ! dec ? r : ( r == 1 ? -1 : 1 ); 
  });
  return sorted;
}

/**
 *
 */
function displayMaturityList( specific ) {
  if ( ! ATTR['maturityHolder'] || ! ATTR['maturityHolder'].size() ) return;

  var grouped = ATTR['maturity']['grouped'];
  ATTR['maturityHolder'].find('.maturity_table_wrapper').each( function(i,dom) {
    var wrapper = $(dom), type = wrapper.attr('data-rule');
    if ( specific && specific != type ) return;

    var list = _getSortedMaturityList ( type ), loop = list.length;
    if ( ! loop ) return wrapper.addClass('hide');
    
    var place = wrapper.find('.list_holder').html('');
    if ( ! place.size() ) return wrapper.addClass('hide');
    
    var out = [], sum = 0;
    for ( var i=0; i<loop; i++ ) {
      var data = typeof(list[i])=='object' ? list[i] : ATTR['maturity']['path'][list[i]];
      if ( ! data || data['mode'] == 'hide' || data['mode']=='deleted' ) continue;

      var amount = data['amount'] ? parseInt(data['amount']) : 0;
      if ( ! isNaN(amount) ) sum += amount;
      out.push( _getMaturityHTML(data) );
    }

    if ( ! out.length ) return wrapper.addClass('hide');
    var footer = wrapper.find('.maturity_table,table').eq(0).clone()
      .removeAttr('id').attr('class','maturity_table footer');

    sum = splitText( sum+'', 3 ).join(' ');
    footer.children().each( function(j,d){
      var n = $(d);
      if ( ! j ) { 
        n.html('<div class="total_label">Sum</div>');
      } else if ( n.hasClass('amount_number') ) {
        n.html(
          '<div class="label total_label">Sum</div>'+
          '<div class="text amount">'+sum+',00</div>'
        );          
      } else { n.html(''); }
    });

    /*
    var form = $(
      '<form method="post" action="" novalidate class="list_holder">'+
        '<ol class="form_row_list maturity_category_list"><li>'+out.join('</li><li>')+'</li></ol>'+
      '</form>'
    ).append( footer );
    place.append( form );
    */

    place.html(
      '<ol class="form_row_list maturity_category_list"><li>'+out.join('</li><li>')+'</li></ol>'
    ).append( footer );

    wrapper.removeClass('hide');
    //renderApplication( place );
  });
}

function displayMovementList() {
  var wrapper = ATTR['movementHolder'];
  if ( ! wrapper || ! wrapper.size() ) return;

  var list = ATTR['movement']['list'], loop = list.length;
  if ( ! loop ) return wrapper.addClass('hide');
  
  wrapper.html('');  

  var out = [], sum = 0;
  for ( var i=0; i<loop; i++ ) {
    var data = typeof(list[i])=='object' ? list[i] : ATTR['movement']['path'][list[i]];
    if ( ! data || data['mode'] == 'hide' || data['mode']=='deleted' ) continue;

    var amount = data['amount'] ? parseInt(data['amount']) : 0;
    if ( ! isNaN(amount) ) sum += amount;
    out.push( _getMovementHTML(data) );
  }

  if ( ! out.length ) return wrapper.addClass('hide');
  wrapper.html(
    _getMovementHeaderHTML()+
    '<ol class="form_row_list movement_category_list"><li>'+out.join('</li><li>')+'</li></ol>'
  );
  wrapper.removeClass('hide');
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
  var target = $(e.target), id = target.attr('id'), code = e.keyCode;
  if ( code == 13 ) {
    if( id=='account_movement_free_text' || id=="sb1_input_placeholder" )
      clickOnAccountMovementSearchBtn();
  }
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
    {'type':'class','what':'hamburger-wrapper', 'grand': true,         'handler': clickOnHamburgerWrapper        },
    {'type':'class','what':'tab_item',                  'grand': true, 'handler': clickOnTabItem                 },
    {'type':'class','what':'page_link',                 'grand': true, 'handler': clickOnPageLink                },
    {'type':'class','what':'maturity_search_btn',                      'handler': clickOnMaturitySearchBtn       },
    {'type':'class','what':'maturity_tool_link',                       'handler': clickOnMaturityToolLink        },
    {'type':'class','what':'menubar_sub_holder',                       'handler': clickOnMenubaSubHolder         },
    {'type':'id',   'what':'main_navigation_toggler',                  'handler': clickOnMainNavigationToggler   },
    {'type':'id',   'what':'primary_navigation_toggler',               'handler': clickOnPrimaryNavigationToggler},
    {'type':'id',   'what':'main_sidebar_toggler',                     'handler': clickOnMainSidebarToggler      },
    {'type':'class','what':'tg_item',                                  'handler': clickOnTGitem                  },
    {'type':'class','what':'account_movement_search_btn',              'handler': clickOnAccountMovementSearchBtn},
    {'type':'class','what':'toggle_gadget',                            'handler': clickOnToggleGadget            },
    {'type':'class','what':'movement_toggler',                         'handler': clickOnMovementToggler         },
    {'type':'class','what':'maturity_table_expander',   'grand': true, 'handler': clickOnMaturityTableExpander   },
    {'type':'class','what':'movement_table_expander',   'grand': true, 'handler': clickOnMovementTableExpander   } 
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

function clickOnPageLink( data ) {
  var current = data['current'], rule = getRule( current );
  if ( ! rule['category'] ) return;
  changeMainContent( rule['page'], null, null, rule['category'], rule['style'] );
}

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
  list.parent().find('> .panel_item').removeClass( mode ).each(function(i,dom){
    $(dom).attr('aria-hidden','true');
  }).eq( index ).addClass( mode ).attr('aria-hidden','false');
}

function clickOnMovementToggler(data) {
  var target = data['current'].closest('.movement_table_expander');
  clickOnMovementTableExpander({'current':target});
}

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

function verifyMaturityDescription( place ) {
  if ( ! place || ! place.size() ) return;
  var form = place.closest('form'), mode = 'verifiedMaturityDescription';
  if ( ! form.size() || form.hasClass(mode) ) return;

  var parent = form.addClass( mode ).parent();
  renderApplication( parent, {'submitCallback': maturitySubmitCallback});

  var wrapper  = parent.closest('.maturity_table_wrapper');
  /*
  var scrolled = getScrollPosition(), top = wrapper.offset().top;
  if ( scrolled[1] > top ) {
    $('html, body').animate({ 'scrollTop': (top-10)+'px' }, 100, function(){});    
    var type = wrapper.attr('date-rule');
    ATTR['maturity']['scroll'] = {'type':type,'scrolled': scrolled};
  }
  */

  /*
  var tSlider = wrapper.find('.maturity_table_slider');
  if ( ! tSlider.size() ) return;

  var id = generateId( parent ), cloned = $('#'+id+'_cloned', tSlider);
  if ( ! cloned.size() ) {
    var time = (new Date()).getTime();
    var html = parent.html().replace( /id=\"([\w\_\-]+)\"/g, 'id="$1_'+time+'"');

    cloned = $('<div id="'+id+'_cloned">'+html+'</div>');
    tSlider.append( cloned );

    renderApplication( cloned );
  }
  tSlider.children().addClass('hide');
  cloned.removeClass('hide').addClass('show_maturity_description');
  */
}

function maturitySubmitCallback( data ) {
  data['main'].find('input').each( function(i,dom) {
    var input = $(dom), value = input.val(), parent = input.closest('li');
    var holder = parent.find('>.text');

    if ( input.hasClass('sb1_amount_field') )
      holder.html( value );
    else if ( input.hasClass('date_calendar_field') )
      holder.html( value.replace(/(\.\d{4})/, '<span class="year">$1</span>') );
    else if ( input.hasClass('payment_from_account') ) {
      var t = input.parent().find('>a > *');
      holder.each( function(j,d){
        $(d).html( t.eq(j).html().replace(/\s+\-\s+kr.*/i,'') );
      });
    }
  });

  clickOnMaturityToolLink( {'current':data['main'].find('.maturity_table,table')},'close')
  return false
}

/**
 *
 */
function clickOnMaturitySearchBtn( data ) {
  var form = $('#maturity_search'), interval = [];
  if ( ! form.size() ) return;

  form.find('.date_calendar_field.maturity' ).each( function(i,input) {
    var date = convertTextToDate( input.value || '' );
    if ( date ) interval[i] = date.getTime();
  });

  if ( ! interval[0] || ! interval[1] ) return;

  form.find('.sb1_calendar_shortcut_item').removeClass('active');
  ATTR['maturity']['interval'] = interval;
}

/**
 *
 */
function clickOnMaturityToolLink( data, force ) {
  var current = data['current'], table = current.closest('.maturity_table,table');
  var parent  = table.parent(), mode = 'show_maturity_description';
  var wrapper = parent.closest('.maturity_table_wrapper');

  if ( current.hasClass('maturity_toggler') ) {
    clickOnMaturityTableExpander( {'target':table,'current':table});
  }
  else if ( force == 'close' || current.hasClass('maturity_edit') || current.hasClass('maturity_close') ) {
    if ( force == 'close' || parent.hasClass('on_edit') || current.hasClass('maturity_close') ) {
      parent.removeClass( 'on_edit' );
      parent.removeClass( mode );      
      wrapper.removeClass('view_detail');
    }
    else {
      verifyMaturityDescription( parent, wrapper.addClass('view_detail') );

      var holder = parent.closest('.list_holder');
      holder.find('.on_edit').removeClass('on_edit');
      holder.find('.'+mode).removeClass( mode );

      parent.addClass( 'on_edit' );
      parent.addClass( mode );
    }
  }
  else if ( current.hasClass('maturity_delete') ) {
    var form = parent.closest('form');
    var id = form.size() ? form.attr('data-rule') : '';
    if ( id ) {
      for ( var i=0; i<ATTR['maturity']['list'].length; i++ ) {
        if ( ATTR['maturity']['list'][i]['id'] == id ) {
          ATTR['maturity']['list'][i]['mode'] = 'deleted';
        }
      }
      form.addClass('hide');
      if ( ! wrapper.find('form:not(.hide)').size() ) wrapper.addClass('hide');
    }
  }
  else if ( current.hasClass('maturity_check') ) {
  }
  else if ( current.hasClass('maturity_sort') ) {
    var mode = 'on_sort', dec = 'decreasing';
    var parent  = current.closest('.maturity_table,table');
    var wrapper = parent.closest('.maturity_table_wrapper');
    var type    = wrapper.attr('data-rule') || '';
    if ( ! type ) return;

    if ( current.hasClass(mode) )
      current.toggleClass( dec );
    else {
      parent.find('.'+mode).removeClass( mode+' '+dec );
      current.addClass( mode );
    }
    displayMaturityList( type );
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

  var wrapper = parent.closest('.maturity_table_wrapper');
  if ( has ) {
    parent.removeClass( mode );
    parent.removeClass( 'on_edit' );
    wrapper.removeClass('view_detail');
  }
  else {
    verifyMaturityDescription( parent,wrapper. addClass('view_detail') ); 

    var holder = parent.closest('.list_holder');
    holder.find('.on_edit').removeClass('on_edit');
    holder.find('.'+mode).removeClass( mode );

    parent.addClass( mode );
  }
}

function clickOnMovementTableExpander( data ) {
  var current = data['current'], parent = current.parent();
  var mode = 'show_movement_description', has = parent.hasClass( mode );
  if ( has ) {
    parent.removeClass( mode );
  }
  else {
    parent.addClass( mode );
  }
}

/**
 *
 */
function clickOnTGitem( data ) {
  var change = data['current'].attr('data-rule') || '';
  if ( ! change ) return;
  var category = data['current'].attr('data-category');
  var style    = data['current'].attr('data-style'); 
  changeMainContent( change, null, null, category, style );
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
function changeMainContent( what, force, startup, category, style ) {
  var key = '', mode = true, map = {
    'new_top_banner'     : 'n_top_banner',
    'new_main_sidebar'   : 'n_sidebar',
    'small_size'         : 'size',
    'shy_main_sidebar'   : 'sidebar',
    'new_blue_line_icon' : 'n_blue_line',
    'merging_blue_line_icon'   : 'm_blue_line',
    'expanding_blue_line_icon' : 'e_blue_line'
  };

  if ( map[what] || what=='maturity_hide_A_N'  || 
    what=='maturity_add_L_N' || what=='maturity_small_T' 
  ) {
    var node = $('#layout'), type = what == 'small_size' ? 'force': what;

    mode = typeof( force ) == 'boolean' ? force :  ! node.hasClass( type );
    key  = map[what] || what;
    
    if ( mode ) { node.addClass( type );    } 
    else        { node.removeClass( type ); }

  }
  else if ( what =='maturity_hide_account_number') {

  }
  else {
    var section = $('#main .separation_content section');
    var one = what ? section.filter('#'+what ) : null;
    if ( ! one || ! one.size() ) {
      if ( category )
        one = section.filter('#none_implemented_'+category );

      if ( ! one || ! one.size() ) {
        one = section.filter('#none_implemented_page' );
        if ( ! one.size() ) return;
      }
    }

    section.hide(); 
    one.show().attr('class', style || '');
    updateWindowHistory( 'style', style || null );
    $('#tool_gadget').removeAttr('class').addClass('display_'+what);
    key = 'display';
  }

  if ( category ) {
    var view = 'display_category_'+category;
    if ( ! ATTR['body'].hasClass( view ) ) {
      var base = ATTR['body'].attr('class') || '', type = trim(
        (base.replace(/display_category_[\w]+/gi,'') + ' '+ view), true
      );
      ATTR['body'].attr( 'class', type );
    }
    if ( ! startup ) updateWindowHistory('category',category);
  }

  if ( ! startup && key ) { 
    updateWindowHistory(key, mode ? what : null);
  }
}

/*
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
  }
}
*/

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
    '<<i class="spinner_rect5"></i>'+
  '</span>';
}

function _getMovementHeaderHTML( data ) {
  return '<ul class="movement_table header">'+
    '<li class="expire_date">Dato</li>'+
    '<li class="kid_or_message">Beskrivelse</li>'+
    '<li class="amount_number">Beløp</li>'+
  '</ul>';
}


function _getMovementHTML( data ) {
  var amount = splitText( data['amount'], 3 ).join(' ');
  var date   = data['date'].replace( /(\.\d{4})/, '<span class="year">$1</span>');
  var html = '<div class="sb1_row_content sb1_input_wrapper">'+
    '<ul class="movement_table movement_table_expander">'+
      '<li class="expire_date">'+
        '<div class="label">Forfall</div>'+
        '<div class="text">'+date+'</div>'+
      '</li>'+
      '<li class="kid_or_message">'+
        '<div class="label">Beskrivelse</div>'+
        '<div class="text name">'+data['msg']+'</div>'+
      '</li>'+
      '<li class="amount_number">'+
        '<div class="label">Beløp</div>'+
        '<div class="text amount">'+amount+',00</div>'+
      '</li>'+
      '<li class="tool_holder">'+
        '<div class="tool_wrapper">'+
          '<a href="#" class="movement_tool_link movement_toggler"><span>Apne</span><span>Lukke</span></a>'+
        '</div>'+
      '</li>'+
    '</ul>'+
    '<ul class="movement_table movement_description">'+
      '<li class="expire_date"></li>'+
      '<li class="bookkeeping">'+
        (data['keeping'] ? '<div class="label">Bokføringsdato</div><div>'+data['keeping']+'</div>' : '') +
      '</li>'+
      '<li class="reference_no">'+
        (data['ref'] ? '<div class="label">Arkivreferanse</div><div>'+data['ref']+'</div>' : '') +
      '</li>'+
      '<li class="m_to_account">'+
        (data['toA'] ? '<div class="label">Til konto</div><div>'+data['toA']+'</div>' : '')+
      '</li>'+
    '</ul>';
  '</div>';
  return html;
}


function __getMaturityHTML( data ) {
  var amount = splitText( data['amount'], 3 ).join(' ');
  var date   = data['date'].replace( /(\.\d{4})/, '<span class="year">$1</span>');
  var html = '<form method="post" action="" novalidate data-rule="'+(data['id']||'')+'">'+
    '<div class="sb1_form_row maximum_width">'+
      '<div class="sb1_row_content sb1_input_wrapper">'+
        '<table>'+
          '<tr class="maturity_row maturity_table_expander">'+
            '<td class="expire_date">'+
              '<div class="label">Forfall</div>'+
              '<div class="text">'+date+'</div>'+
              '<div class="input sb1_calender_field_wrapper_">'+
                '<input id="" name="" type="text" required spellcheck="false" autocomplete="off" data-rule="date parent_target[.sb1_calender_field_parent]" class="date_calendar_field" value="'+data['date']+'">'+
              '</div>'+
            '</td>'+
            '<td class="to_account">'+
              '<div class="label">Til</div>'+
              '<div class="name">'+data['toN']+'</div>'+
              '<div class="number">'+data['toA']+'</div>'+
            '</td>'+
            '<td class="from_account">'+
              '<div class="label">Fra</div>'+
              '<div class="text name">'+data['name']+'</div>'+
              '<div class="text number">'+data['from']+'</div>'+
              '<div class="input">'+
                '<div class="sb1_dropdown_menu account_list _stay_open">'+
                  '<a role="button" aria-controls="payment_from_account_list" href="#" class="sb1_dropdown_btn"></a>'+
                  '<input type="hidden" name="payment_from_account" class="payment_from_account" aria-hidden="true" required data-rule="parent_target[.input]" value="'+data['from'].replace(/\s+/g,'')+'">'+
                '</div>'+
              '</div>'+
            '</td>'+
            '<td class="amount_number">'+
              '<div class="label">Beløp</div>'+
              '<div class="text amount">'+amount+',00</div>'+
              '<div class="input">'+
                '<input name="" type="tel" required spellcheck="false" autocomplete="off" data-rule="amount[decimal] parent_target[.input]" class="sb1_amount_field" value="'+amount+'">'+
              '</div>'+
            '</td>'+
            '<td class="tool_holder">'+
              '<div class="tool_wrapper">'+
                //'<a href="#" class="maturity_tool_link maturity_close"><span>&#215;</span></a>'+
                '<a href="#" class="maturity_tool_link maturity_toggler"></a>'+
                '<a href="#" class="maturity_tool_link maturity_edit">Endre</a>'+
                '<a href="#" class="maturity_tool_link maturity_delete">Slett</a>'+
                '<a href="#" class="maturity_tool_link maturity_check">Start betaling</a>'+
              '</div>'+
            '</td>'+
          '</tr>'+
          '<tr class="maturity_row maturity_description">'+
            '<td class="expire_date">'+
              (data['status'] ? '<div class="label">status</div><div>'+data['status']+'</div>' : '')+
            '</td>'+
            '<td class="to_account">'+
              (data['way'] ? '<div class="label">Betalingsmåte</div><div>'+data['way']+'</div>' : '') +
            '</td>'+
            '<td class="from_account">'+
              (data['msg'] ? '<div class="label">Melding/KID</div><div>'+data['msg']+'</div>' : '')+
            '</td>'+
            '<td class="amount_number"></td>'+
            '<td class="tool_holder">'+
              '<div class="input">'+
                (data['type'] == 'stopped' ? '<a href="#" class="maturity_tool_link_text maturity_start_payment">Start betaling</a>' :
                  (data['type'] =='approved' ? '<a href="#" class="maturity_tool_link_text maturity_stop_payment">Stop betaling</a>' : '')
                )+
              '</div>'+
              '<div class="input submit_wrapper">'+
                '<button class="maturity_table_save action-btn">Lagre</button>'+
              '</div>'+
            '</td>'+
          '</tr>'+
        '</table>'+
      '</div>'+
    '</div>'+
    '<div class="error_summary_holder"></div>'+
  '</form>';
  return html;
}

function _getMaturityHTML( data ) {
  var amount = splitText( data['amount'], 3 ).join(' ');
  var date   = data['date'].replace( /(\.\d{4})/, '<span class="year">$1</span>');
  var html = '<form method="post" action="" novalidate data-rule="'+(data['id']||'')+'">'+
    '<div class="sb1_form_row maximum_width">'+
      '<div class="sb1_row_content sb1_input_wrapper">'+
        '<ul class="maturity_table maturity_table_expander">'+
          '<li class="expire_date">'+
            '<div class="label">Forfall</div>'+
            '<div class="text">'+date+'</div>'+
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
            '<div class="text number">'+data['from']+'</div>'+
            '<div class="input">'+
              '<div class="sb1_dropdown_menu account_list _stay_open">'+
                '<a role="button" aria-controls="payment_from_account_list" href="#" class="sb1_dropdown_btn"></a>'+
                '<input type="hidden" name="payment_from_account" class="payment_from_account" aria-hidden="true" required data-rule="parent_target[.input]" value="'+data['from'].replace(/\s+/g,'')+'">'+
              '</div>'+
            '</div>'+
          '</li>'+
          '<li class="amount_number">'+
            '<div class="label">Beløp</div>'+
            '<div class="text amount">'+amount+',00</div>'+
            '<div class="input">'+
              '<input name="" type="tel" required spellcheck="false" autocomplete="off" data-rule="amount[decimal] parent_target[.input]" class="sb1_amount_field" value="'+amount+'">'+
            '</div>'+
          '</li>'+
          '<li class="tool_holder">'+
            '<div class="tool_wrapper">'+
              //'<a href="#" class="maturity_tool_link maturity_close"><span>&#215;</span></a>'+
              '<a href="#" class="maturity_tool_link maturity_toggler"><span>Apne</span><span>Lukke</span></a>'+
              '<a href="#" class="maturity_tool_link maturity_edit"><span>Endre </span><span>betaling</span></a>'+
              '<a href="#" class="maturity_tool_link maturity_delete"><span>Slett </span><span>betaling</span></a>'+
              '<a href="#" class="maturity_tool_link maturity_check"><span>Start </span><span>betaling</span></a>'+
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
            '<div class="input submit_wrapper">'+
              '<button class="maturity_table_save action-btn">Lagre</button>'+
            '</div>'+
          '</li>'+
        '</ul>'+
      '</div>'+
    '</div>'+
    '<div class="error_summary_holder"></div>'+
  '</form>';
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

    ATTR['maturity']['path'][i+''] = list[i];
    ATTR['maturity']['grouped'][list[i]['type']].push( i+'' );
  }  

  i = getRandom( (loop-1), true );
  list[i]['date']  = convertDateToText( ATTR['today'] );
  list[i]['stamp'] = ATTR['today'].getTime();
  ATTR['maturity']['list'] = list;
}

function _createMovementList() {
  var list = JSON.parse( JSON.stringify(MOVEMENT) ); 
  var loop = list.length, i = 0, j = 0, date = null;
  for ( i=0; i<loop; i++ ) {
    date = new Date(), j = getRandom(40,true);
    date.setDate( date.getDate()+j );
    list[i]['date']  = convertDateToText( date );
    list[i]['stamp'] = date.getTime();

    date = new Date(), j = getRandom(40,true);
    date.setDate( date.getDate()+j );
    list[i]['keeping'] = convertDateToText( date );
    list[i]['k_stamp'] = date.getTime();

    //if ( ! ATTR['movement']['grouped'][list[i]['type']] )
    //  ATTR['movement']['grouped'][list[i]['type']] = [];

    ATTR['movement']['path'][i+''] = list[i];
    //ATTR['movement']['grouped'][list[i]['type']].push( i+'' );
  }  

  //i = getRandom( (loop-1), true );
  //list[i]['date']  = convertDateToText( ATTR['today'] );
  //list[i]['stamp'] = ATTR['today'].getTime();
  ATTR['movement']['list'] = list;
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
