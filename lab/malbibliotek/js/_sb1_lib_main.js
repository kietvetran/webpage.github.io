/******************************************************************************
=== GLOBAL ATTRIBUTE ===
******************************************************************************/
try { CONFIG;  } catch( error ){ CONFIG  = {};   }
try { LIBRARY; } catch( error ){ LIBRARY = null; }
var ATTR = {
  'resizeTimer': 0,
  'scrollTimer': 0,
  'interval'   : 0,
  'index'      : 0,
  'today'      : new Date(),
  'day'        : 60*60*24*1000,
  'queue'      : [],
  'hashList'   : [],
  'history'    : [],
  'cookie'     : 'sb1_lib_cookie',
  'api'        : CONFIG['api'] || {},
  'reference'  : {
    'path':{}, 'list':[], 'original':[], 'item':[], 'level':[],
    'matched':{'path':{},'list':[]},'child': {}, 
    'comment': {}, 'scrolled': {}
  },
  'notVerifyURL'  : false,
  'featureRating' : CONFIG['featureRating'] === 0 ? 0 : (CONFIG['featureRating'] || 10),
  'featureComment': CONFIG['featureComment'] || {'startView':3,'expanding':5},
  'featureItem'   : CONFIG['featureItem']    || {'startView':8,'expanding':8},
  'featureDownload'      : CONFIG['featureDownload']       || false,
  'featureAuthentication': CONFIG['featureAuthentication'] || false,
  'day' : ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
  'linkProfileCenterSearch' :'<a target="_blank" href="https://merkevare.sparebank1.no/portal/doc/index.aspx?query={%22rootIds%22%3A[5164]%2C%22limit%22%3A100%2C%22words%22%3A%22==NAME==%22}&qm=1">'+
    'Merkevare- og Profilsenteret for siste nytt.</a>',
  'linkProfileCenter' :'<a target="_blank" href="https://merkevare.sparebank1.no/login/login.aspx?ReturnUrl=%2findex.aspx&username=SpareBank+1+FELLES&password=uvcUMoic87qA-UitV1sel_kfOsNq2zVX9Lv_-kP6HbcBJVUASugY-XKqt1YfaWE8AsxeVVwdO6Sb7YSTswsihuwsKsAMQP-7SJiGL9dmOeUGh1LLWmMM_2LWn5rfAK-jRcbCXn9zsgeL4eddP7AkeEgJoe_SlQoBQYplPYkltColcwORjYXCx6f3yQp9yVWNVf7oVoENH0K88TV2VS5--5yornTKe3vFMhnritTL1NnmGRUqmuNmekOne2eWLXWWZmsPnPxRcMaER9KbgRuswgMwl1XkmWioycjnYWkk3Vkrx56i1D1pl9WiRKrNLOLwnnQLyHsoQRfc5Ev21d45tZLsRll1psZ6EA8uGiqyx_saGeZexDmO6WmI0KQtaX5S3o1Gy0CZvc0xaOhwkeYtfn-Ss_iPBFbs4AUdmyVa1zm3llGHiF0Ap_5F3sj9C-sm">'+
    'Merkevare- og Profilsenteret for siste nytt.</a>'
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

  ATTR['breadcrumbPlace'] = $('#sb1_lib_breadcrumb_placeholder');
  ATTR['contentPlace']    = $('#sb1_lib_content_placeholder');
  ATTR['commentPlace']    = $('#sb1_lib_comment_placeholder');
  ATTR['searchField']     = $('#sb1_lib_search_field' )
    .on('focus blur', searchFieldFocusEvent )
    .on('keyup', searchFieldKeyupEvent); 

    
  ATTR['lightbox']        = $('#sb1_lib_lightbox');
  ATTR['filterBlock']     = $('#sb1_filter_block');
  ATTR['filterSolution']  = $('#sb1_filter_solution');
  ATTR['filterFramework'] = $('#sb1_filter_framework');
  ATTR['filterApproved']  = $('#sb1_filter_approved');
  ATTR['filterBeta']      = $('#sb1_filter_beta');
  ATTR['filterOld']       = $('#sb1_filter_old');

  ATTR['sortRow']         = $('#sb1_sort_row');
  ATTR['sortDate']        = $('#sb1_sort_date');
  ATTR['sortCharacter']   = $('#sb1_sort_character');


  ATTR['titleHeader']     = $('#sb1_lib_title_header');
  ATTR['toolWrapper']     = $('#sb1_lib_tool_wrapper');
  ATTR['toolSpacer']      = $('#sb1_lib_tool_spacer');

  ATTR['fixedC']          = $('.sb1_fixed_content').eq(0);
  ATTR['fixedS']          = $('.sb1_fixed_spacer').eq(0);

  ATTR['searchProfile']   = $('#sb1_profile_search_field')
    .on('keyup', searchProfileKeyupEvent).on('focus blur', onEventProfileKeyupEvent );

  //ATTR['filterGraphic']      = $('#sb1_filter_graphic');
  //ATTR['filterInteraction']  = $('#sb1_filter_interaction');
 // ATTR['filterFrontEnd']     = $('#sb1_filter_front_ent');
  //ATTR['filterContent']      = $('#sb1_filter_content');

  ATTR['totalItemCount']     = $('#sb1_total_item_count');
  ATTR['statisticHolder']    = $('#sb1_lib_statistic_holder');

  var visibility = readCookie('sb1_lib_visibility') || '', pin = null;
  if ( visibility ) {
    try {
      pin = JSON.parse(visibility);
      $('.sb1_lib_filter_btn.visibility').each( function(i,dom){
        var n = $(dom), r = n.attr('data-rule'), m = 'not_in_view';
        pin[r] === 1 ? n.removeClass( m ) : n.addClass( m ); 
      });
    } catch ( error ) {}
  } 
  updateFilterVisibility( true );

  ATTR['settingCheckHideDescription'] = $('#sb1_lib_setting_collection')
    .find('input').on('change', changeSettingEvent).each( function(i,dom) {
      var node = $(dom), name = node.attr('name'), type = node.attr('type');
      var value = readCookie(ATTR['cookie']+'_s_'+name);

      if ( type.match(/radio|checkbox/) )
        value ? node.prop('checked', 'true') : node.removeAttr('checked');

      changeSettingEvent( null, node );
    });
  //ATTR['settingCheckHideDescription'] = $('#check_hide_description');

  ATTR['commonCommentWrapper'] = $( '#sb1_lib_common_comment_wrapper' ); 
  if ( ATTR['commonCommentWrapper'].size() ) {
    ATTR['topCommentBtn'] = $(
      '<a class="sb1_lib_icon_button sb1_lib_comment sb1_lib_top sb1_lib_disabled" href="#"></a>'
    ).appendTo( ATTR['commonCommentWrapper'] );
  }

  $( document ).on('click', clickEvent).on('keyup', keyupEvent );
  $( window ).on( 'hashchange', hashChangeEvent )
    .on( 'resize', resizeEvent ).on( 'scroll', scrollEvent );

  //eraseCookie( ATTR['cookie']+'_token' );

  if ( ! ATTR['featureDownload'] )
    ATTR['header'].find('.sb1_lib_download').remove();

  ATTR['token'] = readCookie(ATTR['cookie']+'_token');
  if ( ATTR['featureAuthentication'] && ! ATTR['token'] ) {
    ATTR['body'].addClass( 'sb1_lib_need_authentication' );
    $('#sb1_lig_authentication input').eq(0).focus();
  } else { reveal(); }


  //console.log( JSON.stringify(ATTR['reference']['path']['sb1_logo']) );
}

function reveal() { 
  if ( ATTR['revealed'] ) return;
  ATTR['revealed'] = true;
  initializeSB1libLibrary( function() {
    if ( ! ATTR['notVerifyURL'] ) verifyURLoption();
  });
  if ( ATTR['api']['statistic_visitor'] ) {
    setTimeout( function() {
      _uploadStatisticData( _displayStatisticData );
    }, 15 );
  }
}

/**
 *
 */
function verifyURLoption( forceDisplay ) {
  var opts = getURLoption(), order = [
    {'what':'filter',    'handler':displayAccordingToFilter             },
    {'what':'category',  'handler':displayAccordingToFilter             },
    //{'what':'visibility','handler': displayAccordingToVisibility },
    {'what':'display',   'handler':displayInformationById, 'delay':true },
    {'what':'search',    'handler':searchAsURLoption                    }    
  ];

  debug( JSON.stringify(opts) );

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
}

/**
 *
 */
/*
function displayAccordingToVisibility( value ) {
  var mode = 'not_in_view'; 
  ATTR['header'].find( '.sb1_lib_filter_btn.visibility').each( function(i,dom) {
    var node = $(dom), rule = node.attr('data-rule'), reg = createRegExp(rule,true,true);
    if ( value.match( reg ) ) {
      node.addClass( mode );
      ATTR['body'].addClass( rule );
    }
    else {
      node.removeClass( mode );
      ATTR['body'].removeClass( rule );
    }
  });
}
*/
/**
 *
 */
function displayAccordingToFilter( value, key ) {
  if ( ! ATTR['according'] ) ATTR['according'] = [];
  ATTR['according'].push({'key':key,'value':value});

  clearTimeout( ATTR['displayAccordingToFilterTimer'] || 0 );
  ATTR['displayAccordingToFilterTimer'] = setTimeout( function() {
    ATTR['body'].removeClass('sb1_lib_display_profile_center_menu');

    var force = false, mode = 'not_in_view';
    for (var j=0; j<ATTR['according'].length; j++) {
      if ( ATTR['according'][j]['key'] == 'category' ) {
        if ( ATTR['according'][j]['value'] == 'solution' ) {
          ATTR['filterSolution'].removeClass( mode );
          ATTR['filterFramework'].addClass( mode );
          ATTR['filterBlock'].addClass( mode );

          ATTR['body'].addClass('display_solution'); 
          ATTR['body'].removeClass('display_framework');
        }
        else if ( ATTR['according'][j]['value'] == 'framework' ) {
          ATTR['filterFramework'].removeClass( mode );
          ATTR['filterBlock'].addClass( mode );
          ATTR['filterSolution'].addClass( mode );

          ATTR['body'].addClass('display_framework');
          ATTR['body'].removeClass('display_solution'); 
        }
        else {
          ATTR['filterBlock'].removeClass( mode );
          ATTR['filterFramework'].addClass( mode );
          ATTR['filterSolution'].addClass( mode );

          ATTR['body'].removeClass('display_framework');
          ATTR['body'].removeClass('display_solution'); 
        }        
        force = true;
      }
      else if ( ATTR['according'][j]['key'] == 'filter' ) {
        var splited = ATTR['according'][j]['value'].split(';'), note = {};
        for ( var i=0; i<splited.length; i++ ) 
          note['filter'+capitaliseFirstLetter( splited[i] )] = true;

        var filter = ['filterApproved', 'filterBeta', 'filterOld'];
        for ( var i=0; i<filter.length; i++ ) {
          if ( (value == 'none' ||  ! note[filter[i]]) && ATTR[filter[i]] ) 
            ATTR[filter[i]].addClass( mode );
        }
      }
    }

    ATTR['according'] = [];
    if ( isAnyFilterStatusOff() || force ) {
      var h = ATTR['displaySB1libLibrary'] || {};
      displaySB1libLibrary(h['list'],h['matched'],h['force'],h['hash'],null,true);
    }
  }, 30 );
}

/**
 *
 */
function searchAsURLoption( text ) {
  if ( ! text || ! text.replace( /\s+/g, '') ) return;
  ATTR['searchField'].prop('value', text ).focus();
  searchInitializing( text );
}

/**
 *
 */
function setupSB1libLibraryReference( data, level, parent, index ) {
  if ( ! data['id'] ) data['id'] = generateId();

  var cnt     = data['content'] || [], loop = cnt.length, id = data['id'];
  var splited = (data['name'] || '').replace( /\s+/g, ' ')
    .replace( /[\(\)\"\'\W\_\-\.\,]+/g, '').split(' ');
  data['tag'] = (data['tag'] || []).concat( splited );
  data['_character'] = data['rating'] || '0';
  data['_parent'] = parent;
  data['_level']  = level;
  data['_index']  = index;
  data['_type' ]  = (data['type']  || '') +
    (parent ? ((data['type'] ? ' ': '')+ 'p_'+(parent.split(';;').join(' p_') || '')) : '');

  data['_date']  = 0;
  var m = (data['date'] || '').match( /(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if ( m && m.shift() ) {
    for ( var x=0; x<m.length; x++ ) m[x] = parseInt( m[x].replace(/^0/,'') );
    data['_date'] = (new Date( m[2],m[1]-1,m[0],0,0,0,0) ).getTime();
  }
 
  ATTR['reference']['path'][id] = data;
  ATTR['reference']['list'].push( data );

  if ( data['tag'] instanceof Array ) { //&& data['id'] == 'sb1_form_radio' ) {
    var holder = [], length = data['tag'].length;
    for ( var j=0; j<length; j++ ) {
      if ( data['tag'][j].match( /(\s+|^)#/ ) )
        holder.push( data['tag'][j] );
    }
    if ( holder.length ) data['_tag'] = holder;
  }

  if ( isLibraryItem(data) && ! data['approved'] && ! data['old'] )  data['beta'] = '1';
  //if ( ! data['category'] ) data['category'] = 'block';

  var category = {};
  if ( typeof(data['category']) == 'string' )
    category[data['category']] = 1;
  else 
    category = data['category']['pin'] || {};
  for ( var k in category ) {
    data['_leaf_'+k]   = 0;
    data['_leaf_'+k+'_beta']     = data['beta']     ? 1 : 0;
    data['_leaf_'+k+'_approved'] = data['approved'] ? 1 : 0;
    data['_leaf_'+k+'_old']      = data['old']      ? 1 : 0;
  }

  //data['_leaf_'+data['category']]   = 0;
  //data['_leaf_'+data['category']+'_beta']     = data['beta']     ? 1 : 0;
  //data['_leaf_'+data['category']+'_approved'] = data['approved'] ? 1 : 0;
  //data['_leaf_'+data['category']+'_old']      = data['old']      ? 1 : 0;

  if ( ! ATTR['reference']['level'][level] )
    ATTR['reference']['level'][level] = [];
  ATTR['reference']['level'][level].push( data );

  if ( ! loop && parent && ! index ) {
    var s = parent.split(';;'), l = s.length-1;
    var c = ATTR['reference']['path'][s[l]]['content'] || [];
    for ( var j=l; j>=1; j-- )
      ATTR['reference']['path'][s[j]]['_leaf'] += c.length;

    if ( ! data['category'] ) data['category'] = 'block';
  }

  parent = (parent ? parent+';;' : '') + id;
  for ( var i=0; i<loop; i++ ) {
    setupSB1libLibraryReference( cnt[i], level+1, parent, i );

    category = {};
    if ( typeof(cnt[i]['category']) == 'string' )
      category[cnt[i]['category']] = 1;
    else 
      category = cnt[i]['category']['pin'] || {};

    for ( var k in category ) {
      data['_leaf_'+k+'_beta']     += cnt[i]['_leaf_'+k+'_beta']     || 0;
      data['_leaf_'+k+'_approved'] += cnt[i]['_leaf_'+k+'_approved'] || 0;
      data['_leaf_'+k+'_old']      += cnt[i]['_leaf_'+k+'_old']      || 0;
      data['_leaf_'+k] += data['_leaf_'+k+'_beta']+data['_leaf_'+k+'_old'] +
        data['_leaf_'+k+'_approved'];
    }
      /*
    data['_leaf_block_beta']     += cnt[i]['_leaf_block_beta']     || 0;
    data['_leaf_solution_beta']  += cnt[i]['_leaf_solution_beta']  || 0;
    data['_leaf_framework_beta'] += cnt[i]['_leaf_framework_beta'] || 0;

    data['_leaf_block_approved']     += cnt[i]['_leaf_block_approved']     || 0;
    data['_leaf_solution_approved']  += cnt[i]['_leaf_solution_approved']  || 0;
    data['_leaf_framework_approved'] += cnt[i]['_leaf_framework_approved'] || 0;

    data['_leaf_block_old']      += cnt[i]['_leaf_block_old']     || 0;
    data['_leaf_solution_old']   += cnt[i]['_leaf_solution_old']  || 0;
    data['_leaf_framework_old']  += cnt[i]['_leaf_framework_old'] || 0;
    */
  }

  //getStartupComment( data['id'] );
  //createDummyComment( data['id'] );
}

function getBreadcrumbLink( list ) {
  var loop = (list || []).length, out = [], type = 'sb1_lib_breadcrumb_link';
  var opt  = ['block','solution','framework'];
  for ( var i=0; i<loop; i++) {
    if ( list[i]['_level'] && ! list[i]['content'] ) continue;    

    var id   = list[i]['id'], name = capitaliseFirstLetter(list[i]['name']); 
    var rule = '{\'id\':\''+id+'\'}', style = type + ' breadcrumb_'+id;
    for ( var j=0; j<opt.length; j++ )
      style += ' count_'+opt[j]+'_'+(list[i]['_leaf_'+opt[j]] ? 'any' : 'empty');

    out.push(
      '<a href="#" class="'+style+'" data-rule="'+rule+'" title="'+name+'">'+
        '<span class="sb1_lib_name">'+name+'</span>'+
        '<span class="sb1_lib_icon_button arrow_expander"></span>'+
      '</a>'
    );
  }
  return out.join('');
}

function updateCommentNumberView( view, tried, startup ) {
  var render = function() {
    (view || ATTR['main']).find('.sb1_lib_comment').each( function(i,dom) {
      var node = $( dom ), id = getRule( node )['id'];

      if ( typeof(ATTR['reference']['comment'][id])=='undefined' ) {
        return tried == 3 ? null: updateCommentNumberView( 
          node.parent(), (tried ? 1 : ++tried) 
        );
      }

      var count = id ? (parseInt(ATTR['reference']['comment']['_count_'+id] || '') || '') : '';
      node.html( '<span class="count">'+count+'</span>' ).removeClass('sb1_lib_hidden');

      var note = id ? (readCookie( ATTR['cookie']+'_c_'+id ) || '') : '';
      note == count ? node.removeClass('exist_unread_comment') : node.addClass('exist_unread_comment');
    });
  }
  setTimeout( render, startup ? 800 : 15 );
}

function updateBreadcrumbView( data ) {
  if ( ! ATTR['breadcrumb'] || ! data ) return;

  var spl  = (data['_parent'] || '').split(';;'), mode = 'sb1_lib_show';
  spl.push( data['id'] );

  ATTR['breadcrumb'].find('.'+mode ).removeClass( mode );
  ATTR['breadcrumb'].find('.sb1_last_item' ).removeClass( 'sb1_last_item' );
  ATTR['breadcrumb'].find('.sb1_lib_current_active' ).removeClass( 'sb1_lib_current_active' );

  var loop = spl.length, last = null;
  for ( var i=0; i<loop; i++ ) {
    var any = ATTR['breadcrumb'].find('.breadcrumb_'+spl[i] );
    if ( ! any.size() ) continue;
    var parent = any.parent(), first = parent.children().eq(0); 
    any.insertBefore( first );
    if ( (i+1)==loop ) any.addClass( 'sb1_lib_current_active' );
    last = parent.closest('.sb1_lib_breadcrumb_item').addClass( mode );
  }

  if ( last ) last.addClass('sb1_last_item');
  ATTR['onview'] = data['id'];
}

function setupSB1libLibraryCategory( data ) {
  var cnt  = data['content'] || [], loop = cnt.length;
  if ( loop ) {
    data['category'] = {'pin':{},'list':[]}
    for ( var i=0; i<loop; i++ ) {
      var category = setupSB1libLibraryCategory(cnt[i]);
      if ( typeof(category) == 'string' ) {
        var temp = category;
        category = {'pin':{}};
        category['pin'][temp] = true;
      }
      for ( var k in category['pin'] ) {
        if ( ! data['category']['pin'][k] )
          data['category']['list'].push( k );
        data['category']['pin'][k] = (data['category']['pin'][k] || 0)+1;
      }
    }
  }
  else if ( ! data['category'] ) data['category'] = 'block';
  return data['category'];
}

function initializeSB1libLibrary( callback ) {
  ATTR['reference']['original'] = LIBRARY;
  for ( var i=0; i<LIBRARY.length; i++ ) {
    setupSB1libLibraryCategory( LIBRARY[i] );
    setupSB1libLibraryReference( LIBRARY[i], 0 );
  }

  var place = ATTR['breadcrumbPlace'].size() ? 
    ATTR['breadcrumbPlace'] : ATTR['header'];

  ATTR['breadcrumb'] = $('<ul class="sb1_lib_breadcrumb_wrapper"></ul>')
    .appendTo( place );

  var loop = ATTR['reference']['level'].length;
  var place = ATTR['contentPlace'] && ATTR['contentPlace'].size() ? 
    ATTR['contentPlace'] : ATTR['main'];
  for ( var j=0; j<loop; j++ ) {
    var type = 'sb1_lib_main_container index'+j+' '+(j ? 'other' : 'first');
    $('<section class="'+type+'"></section>').appendTo(place);

    var list = ATTR['reference']['level'][j+1];
    if ( ! list ) continue;

    $('<li class="sb1_lib_breadcrumb_item"></li>')
      .appendTo( ATTR['breadcrumb'] ).html( getBreadcrumbLink( list ) );
  }

  displaySB1libLibrary( JSON.parse(JSON.stringify(LIBRARY)), null, null, true, true );
  if ( typeof(callback)=='function' ) callback();
}

function isLibraryItem( data ) {
  return data && ! data['content'] && data['_level'] && data['detail'];
}

function getFilterStatus ( ignorCategory ) {
  var filter =  {
    'approved'   : ! ATTR['filterApproved'].hasClass('not_in_view'),
    'beta'       : ! ATTR['filterBeta'].hasClass('not_in_view'),
    'old'        : ! ATTR['filterOld'].hasClass('not_in_view')
  };
  if (  ! ignorCategory ) {
    filter['category']  = ! ATTR['filterBlock'].hasClass('not_in_view') ? 'block' : (
      ! ATTR['filterSolution'].hasClass('not_in_view') ? 'solution' : 'framework'
    );
  }
  return filter;
} 

function isAnyFilterStatusOff() {
  return true;
  return JSON.stringify(getFilterStatus(true)).match(/false/i);
}

function verifyListToFilterStatus( current ) {
  var cloned = JSON.parse(JSON.stringify(current)), loop = cloned.length;
  for ( var i=0; i<loop; i++ )
    _verifyListToFilterStatus( cloned[i], getFilterStatus() );

  for ( var i=0; i<loop; i++ ) _verifyHideNode( cloned[i] );
  return cloned;
}

function _verifyMatchFilter( data, filter ) {
  if ( data && filter ) {
    if ( filter['category'] ) {
      if ( data['category'] != filter['category'] ) return false;
    } 

    for ( var k in filter ) {
      if ( k == 'category' ) continue;
      if ( data[k] && filter[k] ) return true;
    }
  }
  return false;
}


function _verifyListToFilterStatus( data, filter, parent ) {
  if ( isLibraryItem(data) ) {
    data['_hide'] = ! _verifyMatchFilter( data, filter );
    return;
  }

  var cnt = data['content'] || [], loop = cnt.length;
  for ( var i=0; i<loop; i++ )  _verifyListToFilterStatus(cnt[i],filter);
}

/*
function _verifyListToFilterStatus( data, filter, parent ) {
  if ( isLibraryItem(data) ) {
    var matched = false;
    //if ( filter['category'] ) {
    //  if ( data['category'] != filter['category'] ) return false;
    // 


    for ( var k in filter ) {
      if ( k == 'category' ) continue;
      if ( ! matched && data[k] && filter[k] ) matched = true;
    }

    data['_hide'] = ! matched;
    return;
  }

  var cnt = data['content'] || [], loop = cnt.length;
  for ( var i=0; i<loop; i++ )  _verifyListToFilterStatus(cnt[i],filter);
}
*/

function _verifyHideNode( data ) {
  var cnt = data['content'] || [], loop = cnt.length, hCount = 0;
  if ( ! loop ) return;

  if ( typeof(cnt[0]['_hide']) == 'undefined' ) {
    for ( var i=0; i<loop; i++ ) _verifyHideNode( cnt[i] );
  }

  for ( var i=0; i<loop; i++ ) {
    if ( cnt[i]['_hide'] ) hCount++;
  }
  data['_hide'] = hCount == loop;
}

function displaySB1libLibrary( list, matched, force, hash, startup, toggledStatus ) {
  if ( ! list || ! list.length || ! ATTR['main'] ) return;
  if ( typeof(list)=='object' && !(list instanceof Array) ) list = [list];

  clearTimeout( ATTR['displayTimer'] || 0 );
  var render = function() {
    ATTR['displaySB1libLibrary'] = { 
      'list':JSON.parse(JSON.stringify(list)),'matched':matched,'force':force,'hash':hash
    };

    if ( isAnyFilterStatusOff() ) list = verifyListToFilterStatus(list);

    var out  = [], container = ATTR['main'].find('.sb1_lib_main_container'); 
    var mode = 'on_show', first = list[0] || {}, filter = getFilterStatus();
    for ( var i=0; i<list.length; i++ ) {
      var data = list[i], level = data['_level'], node = container.eq( level );
      if ( ! node.size() ) continue;

      var view = getRule( node )['id'];
      if ( data['id']==view && ! matched && ! toggledStatus ) continue;

      var open = typeof(force)=='boolean' ? force : (level > 0);
      var out = [], cnt = data['content'] || [], loop = cnt.length;
      //if ( ! loop && data['detail'] ) {
      if ( ! loop && isLibraryItem(data) ) {
        out.push( getDataInformation(data) );
        showCommentBoard( data['id'] );
      }
      else {
        ATTR['reference']['matched'] = {'path':{},'list':[]};
        for (var j=0; j<loop; j++ )
          out.push(  _getSB1libContent(cnt[j], 0, matched>1, open) );
      }

      var html = out.join('');
      if ( ! html ) {
        html = matched>1 ? '<div class="sb1_lib_search_no_matched">Ingen treff</div>' :
          '<div class="sb1_lib_library_empty">Tomt liste</div>';
      } 
      else if ( matched>1 && ! html.match(/sb1_lib_matched/) ) {
        html = '<div class="sb1_lib_search_no_matched">Ingen treff</div>';
      }
      
      if ( filter['category'] == 'solution' && ! level ) {
        html = _sortSolutionNode( $('<div>'+html+'</div>') ).html();
        ATTR['body'].addClass('display_solution_top_level');
      }
      else {
        ATTR['body'].removeClass('display_solution_top_level');
      }

      //if ( data['description'] && level && data['content'] ) {
      if ( data['description'] && data['content'] ) {
        html = '<div class="sb1_lib_description sb1_lib_summary">'+
          data['description']+
          '<div class=" sb1_lib_guideline_wrapper"><a href="#" class="sb1_lib_disabled sb1_lib_filter_tool_btn sb1_lib_guideline_btn">Retningslinjer for bruk</a></div>'+
        '</div>' + html;
      }

      node.html( html ).attr('data-rule', '{\'id\':\''+data['id']+'\'}');
      SyntaxHighlighter.highlight();

      node.find('.sb1_lib_rating').on('mouseover mouseout', ratingInOut );
    }

    /*
    if ( ! hash ) { 
      debug('A...');
      updateWindowHistory( 'display', first['_level'] ? first['id'] : null ); 
      setTimeout( function() {
        if ( ATTR['hashTimer'] ) clearTimeout(ATTR['hashTimer'] );
      }, 100 );
    }
    */

    //updateTotalCounterView( );
    updateBreadcrumbView( first );
    updateCommentNumberView( null, null, startup );
    container.removeClass( mode ).eq( first['_level'] || 0 ).addClass( mode );
    if ( ! first['detail'] ) hideCommentBoard();
  };

  if ( startup ) return render(); 
  ATTR['displayTimer'] = setTimeout( render, 50 );
}

function _sortSolutionNode( node ) {
  var item = ATTR['sortRow'].find('> .sb1_lib_sort_item:not(.not_in_view)');
  var view = node.find('.sb1_lib_item_preview'), list = [], out = [], ops = true;

  if ( item.attr('id') == 'sb1_sort_character' ) {
    ops = item.hasClass('view_decreasing');

    view.each(function(i,dom){
      list.push({
        'value': parseFloat($(dom).attr('data-character')),
        'html' : $('<div></div>').append(dom).html()
      });      
    });
  }
  else if ( item.attr('id') == 'sb1_sort_date' ) {
    view.each(function(i,dom){
      list.push({
        'value': parseFloat($(dom).attr('data-date')),
        'html' : $('<div></div>').append(dom).html() 
      });      
    });
  }

  var sorted = list.sort( function(a,b) {
    var x = isNaN(a['value']) ? 0 : a['value']; 
    var y = isNaN(b['value']) ? 0 : b['value'];
    var r = ((x < y) ? -1 : ((x > y) ? 1 : 0));
    return r == 0 || ! ops ? r : ( r == 1 ? -1 : 1 );
  });

  for ( var i=0; i<sorted.length; i++ ) out.push( sorted[i]['html'] );
  return node.html( out.join('') );
}

function _getSB1libContent( data, level, matched, open, hidding ) {
  if ( ! data || data['_hide'] ) return '';

  var type = data['_type'] || data['id'], isTop = ! level;
  var cnt  = data['content'], no = level+2, child = '', check = data['_matched'];
  var id   = data['id'] || generateId(), rule = '{\'id\':\''+id+'\'}';
  var kind = matched ? (check ? 'sb1_lib_matched' : 'sb1_lib_unmatched'): '';
  var href = '#display='+id, filter = getFilterStatus();

  var name = check && check['name'] && check['name']['regexp'] ? highLightText( 
    data['name'] || '',  check['name']['isBaseMatched'] ? check['name']['base'] : ( 
      check['name']['isFullMatched'] ? check['name']['full'] : check['name']['regexp'] 
    )
  ) : (data['name'] || ''); 

  //if ( ! cnt && data['_level'] ) {
  if ( isLibraryItem(data) ) {
    if ( ! matched || check ) {
      ATTR['reference']['matched']['path'][id] = 
        ATTR['reference']['matched']['list'].length;
      ATTR['reference']['matched']['list'].push( data );
    }

    var box = ! ATTR['featureDownload'] || (data['type'] && data['type'].match(/notification/i)) ? 
      '' : '<span class="sb1_lib_collection_item_box"></span>';
    var teaser = '<span class="sb1_lib_teaser">'+
      (data['teaser']||'<i class="sb1_lib_empty"></i>')+
    '</span>'; 
    var what = 'sb1_lib_collection_item' + (type ? ' '+type : '') + 
      (data['teaser'] ? ' get_teaser' : '') + (kind ? ' '+kind : '') +
      //(hidding && ! matched ? ' sb1_lib_hidden' : '');
      (hidding ? ' sb1_lib_hidden' : '');
    var approved = data['approved'] ? 
      '<span class="sb1_approved" title="Godkjent: '+data['approved']+'">'+data['approved']+'</span>' : '';
    var downl = ''; // '<span class="sb1_lib_collection_item_download sb1_lib_icon_button sb1_lib_download" title="Download option is coming soon"></span>';

    return filter['category'] == 'solution' ? _getSB1libContentSolutionItem( data, matched ) :
      '<a class="'+what+'" data-rule="'+rule+'" href="'+href+'">'+
        teaser + '<span class="sb1_lib_name">'+name+'</span>'+(box || downl)+approved+ 
      '</a>';
  } else if ( ! cnt ) { cnt = []; }

  var leaf     = no == 2 ? _getLeafCountHTMl( data ) : '';
  var link     = '<a href="'+href+'" data-rule="'+rule+'" class="sb1_lib_name sb1_lib_breadcrumb_link"><span>'+name+'</span> '+leaf+'</a>';
  var expander = '<a href="#" class="sb1_lib_collection_expander sb1_lib_icon_button arrow_expander"></a>';

  var cType = 'sb1_lib_icon_button sb1_lib_comment sb1_lib_disabled sb1_lib_hidden '+(data['id']||'').replace( /\W+/g,'_');
  var head  = 'sb1_lib_headline'+ (child.match( /\<h\d+\>/i ) ? '' : ' no_sub_headline');
  //var item  = '<h'+(no-1)+' class="'+head+'">'+link +'</h'+(no-1)+'>' +
  //  (level ? '' : '<a href="#" data-rule="'+rule+'" class="'+cType+'" title="Kommentar kommer senere"></a>');

  var conf = ATTR['featureItem'] || {}, view = conf['startView'] || 1000000;
  var loop = cnt.length, i = 0, count = 0, isNextItem = isLibraryItem(cnt[0]);
  var out  = [], gView = conf['gapView'] ? (conf['gapView']+1) : 0; 
  var sum = (conf['startView'] ||0)+gView;
  for ( i=0; i<loop; i++ ) {
    out[i] = _getSB1libContent( cnt[i], level+1, matched, null, count>=view );
    if ( isNextItem && (! matched || out[i].match(/(\"|\s+)sb1_lib_matched/i)) ) count++;
  }

  if( isNextItem && gView && conf['startView'] && (sum>out.length) ) {
    child += out.join('').replace(/(\"|\s+)sb1_lib_hidden/g,''), view = sum;
  } else { child += out.join(''); }

  if ( isNextItem && count>view ) {
    child += '<a href="#" class="sb1_lib_item_link_expander sb1_lib_expander_link" data-rule="'+rule+'">'+
      '<span class="sb1_lib_text">'+_getCollectionExpadingText(id,view)+'</span>'+
    '</a>';
  }

  var description = '<div class="sb1_lib_description">'+
    (data['description'] || ATTR['linkProfileCenterSearch'].replace('==NAME==', data['name']) )+
  '</div>';

  if ( isTop ) {
    var test = child.match( /class="([\w\s\_\-]+)"/ );
    if ( test && ! test[1].match(/sb1_lib_collection_content/) ) {
      var force = 'sb1_lib_collection_content' + 
        (child.match( /sb1_lib_matched/) ? ' sb1_lib_matched' : '');
      child = '<div class="'+force+'">' + child + '</div>'; 
    }
  }

  //var style = (
  //  isTop ? 'sb1_lib_collection_wrapper'+(open ? ' sb1_lib_open' : '') + (type ? ' '+type : ''): 
  //    'sb1_lib_collection_content'
  //) + ' level' +level + (kind ? ' '+kind : '');

  var style = (
    isTop ? 'sb1_lib_collection_wrapper'+ (type ? ' '+type : ''): 
      'sb1_lib_collection_content'
  ) + ' level' +level + (kind ? ' '+kind : '') + ' item_'+id;

  //if ( filter['category']=='solution' ) style += ' sb1_lib_open';
  //return '<div class="'+style+'">'+item + description + child + '</div>';

  //return filter['category']=='solution' ?  child :
  //  '<div class="'+style+'">'+item + description + child + '</div>';
  
  ATTR['reference']['child'][id] = description + child;

  var tag = level ? 'div' : 'article';
  var head  = 'sb1_lib_headline'+ (child.match( /\<h\d+/i ) ? '' : ' no_sub_headline');
  var item  = '<h'+(no-1)+' class="'+head+'">'+link +'</h'+(no-1)+'>' +
    (level ? '' : '<a href="#" data-rule="'+rule+'" class="'+cType+'" title="Kommentar kommer senere"></a>');

  return filter['category']=='solution' || matched ? child :
    '<'+tag+' data-rule="'+rule+'" class="'+style+'">'+
      item + description + child + expander+ 
    '</'+tag+'>';
}

function _getSB1libContentSolutionItem( data, matched ) {
  var desc = data['description'] ? 
    '<div class="sb1_lib_description force_block">'+ data['description']+'</div>' : '';

  var id = data['id'], name = data['name'], link = 
    '<a href="#display='+id+'" data-rule="{\'id\':\''+id+'\'}" class="sb1_lib_item_solution">'+name+'</a>';
  var teaser = data['teaser'] || '<span class="sb1_teaser empty"></span>';
  var mode   = data['_matched'] ? ' sb1_lib_matched' : '';
  var style  = ! matched || mode ? 'sb1_lib_item_preview'+mode : '';

  return '<div class="'+style+'" data-date="'+data['_date']+'" data-character="'+data['_character']+'">' +
    '<div class="header">'+
      link +
      '<div class="">'+
        '<span class="rating">'+(data['rating']||'0')+'</span>'+
        '<span class="date">'+data['date']+'</span>'+ 
      '</div>'+
    '</div>'+
    '<div class="body">'+
      teaser + desc + _getResponsibleHTML( data ) +
    '</div>'+
  '</div>';
}

function _getLeafCountHTMl( data ) {
  var count = 0, filter = getFilterStatus();
  if ( isAnyFilterStatusOff() ) {
    for ( var k in filter ) {
      if (  filter[k] ) count += data['_leaf_'+filter['category']+'_'+k] || 0;
    }
  } else { count = data['_leaf_'+filter['category']] || 0; }
  return  count ? '<span class="sb1_leaf_count">('+count+')</span>' : '';
}

function _getCommentWrappe( id ) {
  var data = ATTR['reference']['path'][id];
  if ( ! data ) return '';

  var conf  = ATTR['featureComment'] || {}; 
  var name  = capitaliseFirstLetter( data['name'] );
  var gView = conf['gapView'] ? (conf['gapView']+1) : 0;
  var rule  = '{\'id\':\''+(id||'')+'\'}', view = conf['startView'] || -1;
  var out   = ['<h3 class="sb1_lib_headline">'+name+' - kommentarer</h3>'];
  var list  = ATTR['reference']['comment'][id] || []; 
  var length = ATTR['reference']['comment']['_count_'+id] || list.length;
  var loop  = view > 0 && (view+gView) < length ? view : length;

  for ( var i=0; i<loop; i++ ) out.push( _getCommentContent(list[i]) );
  if ( out.length == 1 ) 
    out.push('<div class="sb1_lib_comment_content sb1_lib_empty">Ingen kommentar</div>');

  if ( view>0 && length>loop ) {
    out.push(
      '<a href="#" class="sb1_lib_comment_expander sb1_lib_expander_link" data-rule="'+rule+'">'+
        '<span class="sb1_lib_text">'+_getCommentExpadingText(id,loop)+'</span>'+
      '</a>'
    );
  }

  var email = '<input value="" class="sb1_lib sb1_lib_comment_email" type="text" name="comment_email" autocomplete="off" '+
    'placeholder="Email (påkrevd)" autocorrect="off" autocapitalize="off"/>';
  var textarea = '<textarea class="sb1_lib_textarea" style="width:100%"></textarea>';
  var action = '<div class="sb1_lib_action_row">'+
    '<button class="sb1_lib_action_button sb1_lib_send">Send</button>'+
    '<button class="sb1_lib_action_button sb1_lib_reset">Reset</button>'+
  '</div><div class="sb1_lib_action_error"></div>';

  out.push(
    '<div class="sb1_lib_input_wrapper">'+
      '<h4 class="sb1_lib_headline">Legg til dine kommentarer</h4>'+email+textarea+action+
    '</div>'
  );
  var bg = '';//'<div class="sb1_lib_background"><span>'+data['name']+'</span></div>';
  return '<section class="sb1_lib_comment_wrapper" data-rule="'+rule+'">'+
    out.join('')+ bg +
  '</section>';
}

function _getCommentContent( data, mode ) {
  if ( ! data ) return '';
  var text  = data['text'], time = data['created'], author = data['email'];
  var style = 'sb1_lib_comment_content' +(mode ? (' '+mode) : '');
  var rule  = '{\'id\':\''+(data['commentId'] || '')+'\'}';
  return '<div class="'+style+'" data-rule="'+rule+'">'+
    '<h4 class="sb1_lib_headline">'+
      '<span class="sb1_lib_time">'+time+'</span>'+          
      '<span class="author">'+ author+'</span>'+
    '</h4>'+'<div class="sb1_lib_cooment_text">'+text+'</div>'+
  '</div>'
}

function _getCommentExpadingText( id, viewCount ) {
  var list   = ATTR['reference']['comment'][id] || []; 
  var length = ATTR['reference']['comment']['_count_'+id] || list.length;
  var view   = viewCount || ATTR['commentPlace'].find('.sb1_lib_comment_content').size();
  if ( view >= length ) return '';

  var conf = ATTR['featureComment'] || {}, base = conf['expanding'] || 0;
  var sum = view+base, text = base > 0 && sum < length ? 
    ('Hent '+base+' neste av '+(length-view)) : ('Hent ' +(length-view) + ' siste');
  return text;
}

function _getCollectionExpadingText( id, view ) {
  var matched = (ATTR['reference']['matched'] || {})['path'] || {};
  var data    = matched[id] || ATTR['reference']['path'][id];
  if ( ! data || ! view ) return '';

  var list = data['content'] || [], length = 0;
  if ( matched[id] ) {
    for ( var i=0; i<list.length; i++ ) {
      if ( list[i]['_matched'] ) length++;
    }
  } else { length = list.length; }

  if ( view >= length ) return '';

  var conf = ATTR['featureItem'] || {}, base = conf['expanding'] || 0;
  var sum = view+base, text = base > 0 && sum < length ? 
    ('Hent '+base+' neste av '+(length-view)) : ('Hent ' +(length-view) + ' siste');
  return text;
}

/******************************************************************************
=== EVENT FUCNTION ===
******************************************************************************/
function onEventProfileKeyupEvent( e ){
  var mode = 'sb1_profile_search_field_on_focus';
  if ( ATTR['profileFieldBlurTimer'] ) clearTimeout(ATTR['profileFieldBlurTimer']);
  if ( e.type == 'focus' )
    ATTR['body'].addClass( mode );
  else {
    ATTR['profileFieldBlurTimer'] = setTimeout( function() {
      ATTR['body'].removeClass( mode );
    }, 50 );
  }
}

/**
 *
 */
function searchProfileKeyupEvent( e, force ) {
  var field = ATTR['searchProfile']; 
  var code  = force || (e ? e.keyCode : null), value = field.val();
  //if ( code == null || code == 13 || code == 9 || (code>=37 && code<=40) ) return;
  if ( (code === true || code == 13) && value && ATTR['api']['profileSearch'] ) {
    var url = ATTR['api']['profileSearch']+value;
    window.location.href = url;
  }
}

/**
 *
 */
function searchFieldFocusEvent( e ) {
  var field = $(e.currentTarget), mode = 'search_field_on_focus';

  if ( ATTR['searchFieldBlurTimer'] ) clearTimeout(ATTR['searchFieldBlurTimer']);
  if ( e.type=='focus')  return ATTR['body'].addClass( mode );
  ATTR['searchFieldBlurTimer'] = setTimeout( function() {
    if ( ! field.prop('value') ) ATTR['body'].removeClass( mode );
  }, 200 );
}

function searchFieldKeyupEvent( e ){
  var field = $(e.currentTarget), code = e.keyCode;
  if ( code == null || code == 13 || code == 9 || (code>=37 && code<=40) )
    return;

  if ( ATTR['searchTimeout']  ) clearTimeout(  ATTR['searchTimeout']  ); 
  if ( ATTR['searchInterval'] ) clearInterval( ATTR['searchInterval'] );
  if ( code == 27 ) field.attr( 'value', '');  //Esc

  ATTR['searchTimeout'] = setTimeout( function() {
    searchInitializing( field.prop('value') || '' );  
  }, 200 );
}

function searchInitializing( value ) {
  var text = ! value ? '' : value
    .replace( /\s+/gi, ' ' )
    .replace( /\s+eller(\s+|$)/gi, '||' )
    .replace( /\s+/g, ' og ')
    .replace( /\s+og(\s+|$)/gi, ';;' )
    .replace( /^\s+/, '').replace( /\s+$/, '')        
    .replace( /^;;/, '').replace( /;;$/, '')
    .replace( /^\|\|/, '').replace( /\|\|$/, '');

  var oCloned = JSON.parse( JSON.stringify(ATTR['reference']['original']) );
  if ( text == '' )  return displaySB1libLibrary( oCloned, 1 );

  var lCloned  = JSON.parse( JSON.stringify(ATTR['reference']['list']) );
  var filter  = searchFilterGenerating( text, value );
  var matched = searchFilterList( lCloned, filter ), pin = {};

  for ( var i=0; i<matched.length; i++ ) {
    pin[matched[i]['id']] = matched[i]['_matched'] || {};
    var parent = (matched[i]['_parent'] || '').split(';;');
    for (var j=0; j<parent.length; j++ ) pin[parent[j]] = {};
  }

  searchVerifying( oCloned, pin );
  displaySB1libLibrary( oCloned, 2 );
  //clearTimeout( ATTR['kiet'] || 0 );
  //ATTR['kiet'] = setTimeout( function() { console.log(JSON.stringify(oCloned)); }, 500);
}

function searchVerifying( list, pin ) {
  for ( var i=0; i<list.length; i++ ) {
    var data = list[i], id = data['id'], cnt = data['content'] || [];
    if ( pin[id] ) data['_matched'] =  pin[id];
    if ( cnt.length ) searchVerifying( cnt, pin );
  }
}

function searchFilterData( data, filter) {
  var matched = {'count':0,'note':{}}, i = 0, length = filter.length;

  for ( i; i<length; i++ ) { // AND filter
    var keys = filter[i]['keys'] || [], regexp = filter[i]['regexp'];
    if ( ! regexp ) continue;

    var key = '', value = '', j = 0, loop = keys.length;
    for ( j; j<loop; j++ ) { // OR filter
      key = keys[j], value = data[key] || '';

      if ( value instanceof Array ) value = value.join(' ');

      if ( key == 'tag' ) value = value.replace( /\#/g,'' );
       
      if ( (value+'').match(regexp) ) {
        j = loop+1, matched['count'] += 1;

        matched[key] = {
          'key':key,'value': value,'regexp':regexp, 'text': filter[i]['text'],
          'full':filter[i]['full'], 'light':filter[i]['light'],
          'base':filter[i]['base'],
          'isFullMatched' : (filter[i]['full'] && (value || '').match(filter[i]['full']) ),
          'isBaseMatched' : (filter[i]['base'] && (value || '').match(filter[i]['base']) )
        };
      }
    } // End of OR filter
    if ( j == loop ) i = length;
  } // End of AND filter
  return matched;
}

function searchFilterList( list, filter ) {
  if ( ! filter || ! filter.length ) return list;

  var out = [], current = list || [], counter = current.length, x=0;
  while ( x < counter ) {
    var data = current[x++], matched = searchFilterData( data, filter );
    if ( matched['count'] < filter.length ) continue;

    data['_matched'] = matched;
    out.push( data );
  }

  return out;
}

function searchFilterGenerating( text, value ) {
  var specific = '';
  if ( text && text.match( /[\w\,\.]+\:/i ) ) {
    var s = text.split(':');
    text = s[1]; specific = s[0].toLowerCase();
  }

  var list = [text], filter = [], keys = specific ? specific.split(',') : ['name','tag'];
  var base = value ? createRegExp(value,true,true,true) : null;

  for ( var i=0; i<list.length; i++ ) {
    if ( typeof(list[i]) != 'string' ) continue;    

    list[i] = list[i].replace( /\;\;(\s+)?$/g, '' )
      .replace( /\|\|(\s+)?$/g, '' ).replace( /\s+$/g, '' );

    var replaced = list[i].replace( /\|\|/ig, '|' ); 
    //if ( replaced.match( /\|/ ) ) replaced = replaced.replace(/;;/g, ' ');
    var splited  = replaced.split( /\;\;/ig );
    var full     = createRegExp(replaced,true,true,true);
    for ( var j=0; j<splited.length; j++ ) {
      var v  = splited[j].replace( /^\s+/, '' ); 
      var r = createRegExp(v,true,true,true);

      filter.push({
        'keys'  : keys,
        'regexp': r,
        'value' : value,
        'text'  : v,
        'full'  : full,
        'base'  : base, 
        'light' : true
      });
    }
  }

  return filter;
}

/**
 *
 */
function scrollEvent( e ) {
  if ( ATTR['fixedS'].size() && ATTR['fixedC'].size() ) {
    var mode = 'sb1_lib_scroll_passed', scrolled = getScrollPosition();
    var offset = ATTR['fixedS'].offset(), has = ATTR['body'].hasClass(mode);
    if ( offset.top < scrolled[1] ) {
      ATTR['body'].addClass( mode );
      if ( ! has ) { 
        var height = ATTR['fixedC'].prop('clientHeight');
        ATTR['fixedS'].css({'height': height+'px;'});
        ATTR['scroll_passed'] = true;
        setTimeout( function() { ATTR['scroll_passed'] = false; }, 50 );
      }
    }
    else if ( ! ATTR['scroll_passed'] ) {
      ATTR['body'].removeClass( mode );
      ATTR['fixedS'].removeAttr('style');
    }
  }
}

 /*
function scrollEvent( e ) {
  //clearTimeout( ATTR['scrollTimer'] );
  //ATTR['scrollTimer'] = setTimeout( function() {
    var mode = 'sb1_lib_scroll_passed', scrolled = getScrollPosition();
    var offset = ATTR['toolSpacer'].offset(), has = ATTR['body'].hasClass(mode);
    if ( offset.top < scrolled[1] ) {
      ATTR['body'].addClass( mode );
      if ( ! has ) { 
        var height = ATTR['toolWrapper'].prop('clientHeight');
        ATTR['toolSpacer'].css({'height': height+'px;'});
        ATTR['scroll_passed'] = true;
        setTimeout( function() { ATTR['scroll_passed'] = false; }, 50 );
      }
    }
    else if ( ! ATTR['scroll_passed'] ) {
      ATTR['body'].removeClass( mode );
      ATTR['toolSpacer'].removeAttr('style');
    }
  //}, 50 );
}
*/

/**
 *
 */
function keyupEvent( e ) {
  var target = $(e.target), code = e.keyCode, id = target.attr('id') || '';
  if ( code==13 && (id=='sb1_lib_usr_field' || id=='sb1_lib_pwd_field'))
    return verifyLogin();
}

/**
 *
 */
function resizeEvent( e ) {
  clearTimeout( ATTR['resizeTimer'] );
  ATTR['resizeTimer'] = setTimeout( function() {
    var list = ATTR['iframeHolder'] || [], loop = list.length, temp = [];
    if ( ! loop ) return;
    for ( var i=0; i<loop; i++ ) {
      var node = $( '#'+list[i] );
      if ( ! node.size() ) continue;
      temp.push( list[i] ), setIframeHeight( node.get(0), true );
    }
    ATTR['iframeHolder'] = temp;
  }, 200 );
  _resizeAppender( e );
}

/**
 *
 */
function changeSettingEvent( e, input ) {
  var node = input || $(e.currentTarget), name = node.attr('name'); 
  var type = node.attr('type'), value = type.match(/checkbox|radio/i) ? 
    (node.prop('checked') ? 1 : 0) : node.val();

  if ( name == 'toggleAllDescription') toggleAllDescription( value );
  
  if ( e ) createCookie( ATTR['cookie']+'_s_'+name, value, 365 );
}

/**
 *
 */
function clickEvent( e ) {
  if ( ATTR['dragged'] ) return e.preventDefault();
  if ( e['which'] == 3 ) return true;

  var target  = $( e.target ), parent = target.parent();
  var disabled = target.hasClass('disabled') || parent.hasClass('disabled') ||
    target.hasClass('sb1_lib_disabled') || parent.hasClass('sb1_lib_disabled');
  if ( disabled ) {
    e.preventDefault();
    return false;
  }

  var href = target.attr('href') || parent.attr('href') || '';
  if ( href.length > 3 && ! href.match( /^\#/ ) ) return true;
  var order = [
    {'type':'id',   'what':'sb1_profile_search_btn',                 'handler': clickOnProfileSearchBtn },
    {'type':'class','what':'profile_center_dropdown_link',           'handler': clickOnProfileCenterDropdownLink },  
    {'type':'id',   'what':'sb1_lib_profile_center_menu',            'handler': clickOnSB1libProfileCenterMenu },
    {'type':'class','what':'dropdown',                               'handler': clickOnProfileCenterDropdown },
    {'type':'class','what':'sb1_lib_collection_item_download',       'handler': clickOnSB1libCollectionItemDownload },
    {'type':'class','what':'sb1_lib_collection_item_box',            'handler': clickOnSB1libCollectionItemBox },
    {'type':'class','what':'sb1_lib_collection_item', 'grand': true, 'handler': clickOnSB1libCollectionItem    },
    {'type':'class','what':'sb1_lib_sort_item',       'grand': true, 'handler': clickOnSB1libSortItem          },
    {'type':'class','what':'sb1_lib_item_solution',                  'handler': clickOnSB1libCollectionItem    },
    {'type':'class','what':'sb1_link_item',                          'handler': clickOnSB1libCollectionItem    },
    {'type':'class','what':'sb1_lib_collection_expander',            'handler': clickOnSB1libCollectionExpander},
    {'type':'class','what':'sb1_lib_item_link_expander',             'handler': clickOnSB1libItemLinkExpander  },
    {'type':'class','what':'sb1_lib_comment',                        'handler': clickOnSB1libComment           },
    {'type':'class','what':'sb1_lib_breadcrumb_link',                'handler': clickOnSB1libBreadcrumbLink    },
    {'type':'class','what':'sb1_lib_tab_link',                       'handler': clickOnSB1libTabLink           },
    {'type':'class','what':'sb1_lib_action_button',                  'handler': clickOnSB1libActionButton      },
    {'type':'class','what':'sb1_lib_navigation_next',                'handler': clickOnSB1libNavigation        },
    {'type':'class','what':'sb1_lib_navigation_previous',            'handler': clickOnSB1libNavigation        },
    {'type':'class','what':'sbl1_lib_code_select_all',               'handler': clickOnSB1libCodeSelectAll     },
    {'type':'class','what':'sbl1_lib_code_copy',                     'handler': clickOnSB1libCodeCopy          },
    {'type':'class','what':'sbl1_lib_code_toggler',                  'handler': clickOnSB1libCodeToggler       },
    {'type':'class','what':'sb1_lib_comment_expander',               'handler': clickOnSB1libCommentExpander   },
    {'type':'class','what':'sb1_lib_search_idea',                    'handler': clickOnSB1libSearchIdea        },
    {'type':'class','what':'sb1_lib_search_undo',                    'handler': clickOnSB1libSearchUndo        },
    {'type':'class','what':'sb1_lib_filter_btn',                     'handler': clickOnSB1libFilterBtn         },
    {'type':'class','what':'sb1_lib_filter_tool_btn',                'handler': clickOnSB1libFilterToolBtn     },
    {'type':'class','what':'sb1_lib_close_lightbox_btn',             'handler': clickOnSB1libCloseLightboxBtn  },
    {'type':'class','what':'sb1_lib_information_btn',                'handler': clickOnSB1libInformationBtn    },
    {'type':'class','what':'sb1_lib_update_statistict_btn',          'handler': clickOnSB1libUpdateStatisticBtn},
    {'type':'class','what':'sb1_lib_tag_filter_btn',                 'handler': clickOnSB1libTagFilterBtn      },
    {'type':'id',   'what':'sb1_lib_burger_menu',                    'handler': clickOnSB1libBurgerMenu        },
    {'type':'id',   'what':'sb1_lib_statistic_btn',                  'handler': clickOnSB1libStatisticBtn      },
    {'type':'id',   'what':'sb1_lib_setting_btn',                    'handler': clickOnSB1libSettingBtn        },
    {'type':'class','what':'graphic_text',                           'handler': clickOnTextContent             },
    {'type':'class','what':'interaction_text',                       'handler': clickOnTextContent             },
    {'type':'class','what':'front_end_text',                         'handler': clickOnTextContent             },
    {'type':'class','what':'content_text',                           'handler': clickOnTextContent             },
    {'type':'id',   'what':'sb1_lib_login',                          'handler': clickOnSB1libLogin             },
    {'type':'class','what':'sb1_lib_rating',                         'handler': clickOnSB1libRating            }
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
  return true;
}

function clickOnProfileSearchBtn( data ) { 
  searchProfileKeyupEvent( null, true );
}

function clickOnProfileCenterDropdownLink( data ) {
  var href = data['current'].attr('href') || '';
  if ( href.match(/block/i) )
    clickOnSB1libFilterBtn({'current':$('#sb1_filter_block')});
  else if ( href.match(/solution/i) )
    clickOnSB1libFilterBtn({'current':$('#sb1_filter_solution')});
  else if ( href.match(/framework/i) )
    clickOnSB1libFilterBtn({'current':$('#sb1_filter_framework')});
  return false;
}

function clickOnSB1libSortItem( data ) { 
  var current = data['current'], parent = current.parent();
  var value = ATTR['searchField'].prop('value'), mode = 'not_in_view';
  if ( current.hasClass(mode) ) {
    parent.find('.sb1_lib_sort_item').addClass( mode );
    current.removeClass( mode );
    //value ? searchInitializing(value) : 
    //  displaySB1libLibrary( JSON.parse(JSON.stringify(ATTR['reference']['original'])) );
  } 
  else if ( current.hasClass('allow_increasing_decreasing') ) {
    current.toggleClass('view_decreasing');
    //value ? searchInitializing(value) : 
    //  displaySB1libLibrary( JSON.parse(JSON.stringify(ATTR['reference']['original'])) );
  }

  var where = ATTR['contentPlace'].find('>.on_show');
  if ( where.size() ) _sortSolutionNode( where );
}

function clickOnSB1libProfileCenterMenu( data ) {
  ATTR['body'].toggleClass( 'sb1_lib_display_profile_center_menu' );  
}

function clickOnProfileCenterDropdown( data ){
  var current = data['current'], mode = 'expanded';
  if ( current.hasClass(mode) ) 
    current.removeClass( mode );
  else {
    current.parent().find('.'+mode).removeClass( mode );
    current.addClass( mode );
  }
}

function clickOnTextContent( data ) {
  var target = data['target'], mode = 'reveal', pin = {
    'graphic_text'     : 'display_graphic',
    'interaction_text' : 'display_interaction',
    'front_end_text'   : 'display_front_end',
    'content_text'     : 'display_content'
  };
  for ( var k in pin ) {
    if ( ! target.hasClass(k) ) continue;

    if ( ! ATTR['body'].hasClass(pin[k]) && ! target.hasClass(mode) )
      target.addClass( mode );
    return;
  }
}

function clickOnSB1libRating( data ) {
  var current = data['current'], parent = current.parent(), mode = 'on_selected';
  var all = parent.children(), loop = all.size(), index = all.index(current);
  var act = all.filter('.'+mode);

  if ( act.size() && all.index(act.last())==index ) index = -1;

  for (var i=0; i<loop; i++) {
    i<=index ? all.eq(i).addClass( mode ): all.eq(i).removeClass(mode);
  }
}

function clickOnSB1libTagFilterBtn( data ) {
  var value = 'tag:'+data['current'].text().replace(/\#/g, '');
  ATTR['searchField'].prop('value', value).focus();
  searchInitializing( value );

  setTimeout( function() { updateWindowHistory('search', value ); }, 200 );
}

function clickOnSB1libBurgerMenu( data ) {
  var mode = 'display_burger_menu', has = ATTR['body'].hasClass( mode );
  if ( has ) return ATTR['body'].removeClass( mode );

  generateId( data['current'] );
  data['rm']     = mode;
  data['parent'] = ATTR['body'].addClass( mode );
  return 1;
}

function clickOnSB1libFilterToolBtn( data ) {
  ATTR['body'].toggleClass('display_tool_filter');
}

function clickOnSB1libUpdateStatisticBtn( data ) {
  data['current'].addClass('sb1_lib_disabled');
  ATTR['statisticHolder'].html( _getSpinnerHTML() );
  _displayStatisticData( function() {
    data['current'].removeClass('sb1_lib_disabled');
  });
}

function clickOnSB1libInformationBtn( data ) {
  ATTR['body'].addClass( 'sb1_lib_display_information' );  
  ATTR['reference']['scrolled']['lightbox'] = getScrollPosition();
  $('html, body').animate({ 'scrollTop': '0' }, 10, function() {});
}

function clickOnSB1libSettingBtn( data ) {
  ATTR['body'].addClass( 'sb1_lib_display_setting' );
}

function clickOnSB1libStatisticBtn( data ) {
  ATTR['body'].addClass( 'sb1_lib_display_statistic' );
}

function clickOnSB1libCloseLightboxBtn( data ) {
   ATTR['body'].removeClass( 
    'sb1_lib_need_authentication sb1_lib_display_setting '+
    'sb1_lib_display_information sb1_lib_display_statistic' 
  );
  if ( ATTR['reference']['scrolled']['lightbox'] ) {
    var top = ATTR['reference']['scrolled']['lightbox'][1];
    $('html, body').animate({ 'scrollTop': top+'px' }, 10, function() {});
  }
  ATTR['reference']['scrolled']['lightbox'] = null;
}

function clickOnSB1libLogin( data ) { verifyLogin(); }

function clickOnSB1libFilterBtn( data ) {
  var current = data['current'], mode = 'not_in_view', filter = {}, radio = false;
  if ( current.hasClass('visibility') ) {
    current.toggleClass( mode );
    return updateFilterVisibility();
  }
  else if ( current.hasClass('filter_radio') ) {
    if ( ! current.hasClass(mode) ) {
      var container = ATTR['main'].find('.sb1_lib_main_container'); 
      var viewed = container.filter('.on_show');
      if ( viewed.size() && ! container.index(viewed) ) return;
    }

    current.parent().find('.filter_radio').addClass( mode );
    current.removeClass( mode );
    filter = getFilterStatus();

    updateWindowHistory( 'category', filter['category'] == 'block' ? null : filter['category'] );
    if ( filter['category'] == 'block' ) {
      ATTR['body'].removeClass('display_framework');
      ATTR['body'].removeClass('display_solution'); 
    }
    else if ( filter['category'] == 'solution' ) {
      ATTR['body'].removeClass('display_block');
      ATTR['body'].removeClass('display_framework');
      ATTR['body'].addClass('display_solution'); 
    }
    else if ( filter['category'] == 'framework' ) {
      ATTR['body'].removeClass('display_block');
      ATTR['body'].removeClass('display_solution'); 
      ATTR['body'].addClass('display_framework'); 
    }
    radio = true;
    setTimeout( verifyScrollToToolSpacer, 200 );
  }
  else {
    data['current'].toggleClass( 'not_in_view' );
  }

  var h = ATTR['displaySB1libLibrary'] || {}, f = [], list =
    radio ?  JSON.parse(JSON.stringify(ATTR['reference']['original'])) : h['list'];
  //displaySB1libLibrary(h['list'],h['matched'],h['force'],h['hash'],null,true);

  radio && ATTR['searchField'].get(0).value ? 
    searchInitializing( ATTR['searchField'].get(0).value ) : 
    displaySB1libLibrary(list,h['matched'],h['force'],h['hash'],null,true);
 
  if ( isAnyFilterStatusOff() ) {
    filter = getFilterStatus( true );
    for ( var k in filter ) {
      if ( filter[k] ) f.push(k);
    }
    if ( f.length == 0 ) f.push('none');
  }

  updateWindowHistory( 'filter', f.length ? f.join(';') : null );
  setTimeout( function() {
    if ( ATTR['hashTimer'] ) clearTimeout(ATTR['hashTimer'] );
  }, 100 );
}

function clickOnSB1libTabLink( data ) {
  var current = data['current'], parent = current.closest('.sb1_lib_tab_item');
  var item    = parent.parent().children();
  var index   = item.index( parent ), mode = 'sb1_lib_open';
  if ( index < 0 || parent.hasClass(mode) ) return;

  var wrapper = parent.closest('.sb1_lib_tab_wrapper');
  var content = wrapper.find('> .sb1_lib_tab_content').children();

  item.removeClass(mode).eq( index ).addClass( mode );
  var cnt = content.removeClass(mode).eq( index ).addClass( mode );

  cnt.find('iframe').each( function(i,dom) {
    setIframeHeight(dom,true);
  });
}

function clickOnSB1libCodeSelectAll( data ) {
  var parent = data['current'].closest('.sb1_lib_code_wrapper');
  var node   = parent.find('.code'), text = node.size() ? node.text() : '';
  if ( text ) setSelectionRange( node.get(0),0,text.length);
}

function clickOnSB1libCodeCopy( data ) {
}

function clickOnSB1libCodeToggler( data ) {
  var current = data['current'], mode = 'sb1_lib_open';
  var parent = current.closest('.sb1_lib_code_wrapper');
  parent.toggleClass( mode );
}

function clickOnSB1libBreadcrumbLink( data ) {
  var current = data['current'], id = getRule( current )['id'];
  if ( data['target'].hasClass('arrow_expander') )
    return showSB1BreadcrumbLinkOption( data );

  if ( ! id ) {
    if ( current.hasClass('sb1_lib_reset') ) 
      return displaySB1libLibrary( JSON.parse(JSON.stringify(ATTR['reference']['original'])) );
    id = ATTR['reference']['level'][0] && ATTR['reference']['level'][0][0] ? 
      (ATTR['reference']['level'][0][0]['id'] || '') : '';
  }

  var data = ATTR['reference']['path'][id];
  if ( ! data ) return;

  var view = ATTR['onview'] || '';
  var now  = ATTR['reference']['path'][view];
  var scrolled = getScrollPosition();

  //ATTR['history'].push( {'id': data['id'], 'scrolled': getScrollPosition()});
  //$('html, body').animate({ 'scrollTop': '0' }, 0, function() {});
  displaySB1libLibrary( [data] );
  
  if ( now && now['_level']<data['_level'] ) {
    ATTR['reference']['scrolled'][now['id']] = scrolled;
    $('html, body').animate({ 'scrollTop': '0' }, 0, function() {});
  }
  else if ( ATTR['reference']['scrolled'][id] ) {
    var top = ATTR['reference']['scrolled'][id][1];
    setTimeout( function() {
      $('html, body').animate({'scrollTop': top+'px' }, 0, function() {});    
    }, 100 );
    ATTR['reference']['scrolled'][id] = null;
  }
  else {
    $('html, body').animate({ 'scrollTop': '0' }, 0, function() {});
  }
}

function clickOnSB1libActionButton( data ) {
  var current = data['current'], out = [], renderReset = function() {
    resetYourCommentNewText();
    var wrapper = current.closest('.sb1_lib_comment_wrapper');
    wrapper.find('input[type="text"]').each( function(i,dom) {
      dom.value = '';
    });
    wrapper.find('.sb1_lib_action_error').html('');
  };

  if ( current.hasClass('sb1_lib_send') ) {
    var wrapper = current.closest('.sb1_lib_comment_wrapper');

    var msg   = wrapper.find('.sb1_lib_action_error');
    var email = wrapper.find('.sb1_lib_comment_email');
    var id    = getRule( wrapper )['id'], data =  {
      'elementName': id,
      'email': email.prop('value')     || '',
      'text' : (getYourCommentNewText()|| '').replace(/\'/g,'&#39;')
    };

    if ( ! data['email'] ) 
      out.push( 'Email adresse er påkrevd' );
    else if ( ! data['email'].match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i) ) 
      out.push( 'E-post adressen er ugyldig' );

    if ( ! data['text'].replace(/\s+/g,'') ) 
      out.push('Din kommentar er påkrevd');

    if ( out.length )
      return msg.html( capitaliseFirstLetter(out.join(' og ')) );

    if ( ! ATTR['reference']['comment'][id] );
      ATTR['reference']['comment'][id] = [];

    $.ajax({'type':'POST','url':ATTR['api']['commentPush'],'data':data,'success': function (s) {
      if ( ! s ) return;
      ATTR['reference']['comment'][id].unshift(s);
      wrapper.find('>.sb1_lib_empty').remove();
      var node = $(_getCommentContent(ATTR['reference']['comment'][id][0]));
      var cnt  = wrapper.find('> .sb1_lib_comment_content, > .sb1_lib_input_wrapper');
      node.insertBefore( cnt.eq(0) );
      renderReset();

      if ( ! ATTR['reference']['comment']['_count_'+id] )
        ATTR['reference']['comment']['_count_'+id] = 0;
      ATTR['reference']['comment']['_count_'+id]++;

      updateCommentNumberView();

      var top = node.offset().top, scrolled = getScrollPosition();
      if ( scrolled[1] > top )
        $("html, body").animate({ "scrollTop": top+"px" }, function() {});
    }});

    /*
    ATTR['reference']['comment'][id].unshift(s);
    */
  }
  else if ( current.hasClass('sb1_lib_reset') ) {
    renderReset();
  }
  //clickOnSB1libComment( data );
}

function clickOnSB1libItemLinkExpander( data ) {
  var current = data['current'], id = getRule( current )['id'];
  var wrapper = current.closest(
    '.sb1_lib_collection_content, .sb1_lib_collection_wrapper'
  );

  var mode = 'sb1_lib_hidden', hidden = wrapper.find('.'+mode);
  var conf = ATTR['featureItem'] || {}, base = conf['expanding'] || 1000000;

  var loop = base < hidden.size() ? base : hidden.size();
  for ( var i=0; i<loop; i++ ) hidden.eq(i).removeClass( mode );

  var item = wrapper.find('.sb1_lib_collection_item');
  var view = item.not('.'+mode+', .sb1_lib_unmatched').size();
  
  var nextText = _getCollectionExpadingText( id, view );
  nextText ? data['target'].html( nextText ) : current.remove();
}

function clickOnSB1libCommentExpander( data ) {
  var current = data['current'], id = getRule( current )['id'];
  var wrapper = current.closest('.sb1_lib_comment_wrapper');
  var list    = ATTR['reference']['comment'][id] || [];
  var view    = list.length, out = [], mode = 'sb1_lib_hide';

  var conf = ATTR['featureComment'] || {}, base = conf['expanding'] || 0;
  var sum  = view+base, url = ATTR['api']['commentList']+'/'+id+'/'+view+'/'+sum;

  $.ajax({'type':'GET','url':url,'success':function (s) {  
    if ( ! s ) return;

    ATTR['reference']['comment'][id] = ATTR['reference']['comment'][id].concat( s );    
    list = ATTR['reference']['comment'][id];
    var loop = base>0 && sum < list.length ? sum : list.length;
    for ( var i=view; i<loop; i++ ) out.push( _getCommentContent(list[i],mode) );

    var node = $( out.join('') ).insertBefore( current );
    setTimeout( function() { node.removeClass( mode );}, 100);
    
    var nextText = _getCommentExpadingText( id, loop );
    nextText ? data['target'].html( nextText ) : current.remove();    
  }});  

  /*
  var existed = wrapper.find('.sb1_lib_comment_content');
  var view    = existed.size(), out = [], mode = 'sb1_lib_hide';
  var list    = ATTR['reference']['comment'][id] || [], length = list.length;

  var conf = ATTR['featureComment'] || {}, base = conf['expanding'] || 0;
  var sum  = view+base, loop = base>0 && sum < length ? sum : length;
  for ( var i=view; i<loop; i++ ) out.push( _getCommentContent(list[i],mode) );

  var node = $( out.join('') ).insertBefore( current );
  setTimeout( function() { node.removeClass( mode );}, 100);
  
  var nextText = _getCommentExpadingText( id, loop );
  nextText ? data['target'].html( nextText ) : current.remove();
  */
}

function clickOnSB1libComment( data ) {
  var current = data['current'], id = getRule( current )['id'], top = false;
  var wrapper = current.closest('.sb1_lib_collection_wrapper, #sb1_lib_header');
  if ( wrapper.hasClass('sb1_lib_comment_active') ) 
    return hideCommentBoard();
  
  if ( ! id && current.hasClass('sb1_lib_top') ) {
    var any = ATTR['breadcrumb'] ? 
      ATTR['breadcrumb'].find('.sb1_lib_current_active') : null;

    id = any && any.size() ? getRule( any.eq(any.size()-1) )['id'] : (
      ATTR['reference']['level'][0] && ATTR['reference']['level'][0][0] ?
        ATTR['reference']['level'][0][0]['id'] : ''
    );
    top = true;
  }
  showCommentBoard( id, wrapper, top );
}

function verifyScrollToToolSpacer() {
  var spacer = ATTR['toolSpacer'];
  if ( ! spacer || ! spacer.size() ) return;

  var top = spacer.offset().top; 
  if ( ! top || top < 0 ) return;

  var scrolled = getScrollPosition();
  if ( top > scrolled[1] ) return;
  $('html, body').animate({ 'scrollTop': top+'px' }, 10, function() {});
}

function showCommentBoard( id, wrapper, fromTop, tried ) {
  if ( ! id || ! ATTR['commentPlace'] || ! ATTR['commentPlace'].size() ) return;
 

  //theme_advanced_buttons1 : "separator,insertdate,inserttime,preview,zoom,separator,forecolor,backcolor",
  //theme_advanced_buttons2 : "bullist,numlist,separator,outdent,indent,separator,undo,redo,separator",
  //theme_advanced_buttons3 : "hr,removeformat,visualaid,separator,sub,sup,separator,charmap"

  if ( typeof(ATTR['reference']['comment'][id+'_done'])=='undefined' ) {
    return tried == 5 ? null : setTimeout( function() { showCommentBoard( 
      id, wrapper, fromTop, (tried ? 1 : ++tried) 
    )}, 500 );
  }

  ATTR['commentPlace'].html( _getCommentWrappe(id) );
  /*
  tinyMCE.init({
    'mode' : "textareas",
    'theme' : "advanced",
    'theme_advanced_toolbar_location' : "top",
    //'theme_advanced_buttons1' : "bold,italic,underline,link,bullist,numlist",
    //'theme_advanced_buttons1' : "bold,italic,underline,forecolor,backcolor,bullist,numlist,undo,redo",
    'theme_advanced_buttons1' : "bold,italic,underline,forecolor,backcolor,bullist,link,unlink",
    'theme_advanced_blockformats' : "p,div,h1,h2,h3,h4,h5,h6,blockquote,dt,dd,code,samp",
    'theme_advanced_path' : null
  });
  */
  ATTR['body'].find('.sb1_lib_comment_active').removeClass('sb1_lib_comment_active');
  if ( wrapper ) wrapper.addClass('sb1_lib_comment_active');
  ATTR['body'].addClass( 'sb1_lib_open_comment' );

  fromTop ? ATTR['body'].addClass('sb1_lib_comment_trigger_from_top') : 
    ATTR['body'].removeClass('sb1_lib_comment_trigger_from_top');

  var count = parseInt(ATTR['reference']['comment']['_count_'+id] || '') || '';
  createCookie( ATTR['cookie']+'_c_'+id, count, 365 );
}

function hideCommentBoard() {
  ATTR['body'].find('.sb1_lib_comment_active').removeClass('sb1_lib_comment_active');
  ATTR['body'].removeClass('sb1_lib_comment_trigger_from_top')

  var any = ATTR['main'].find('.on_show > .sb1_lib_item_detail');
  any.size() ? ATTR['body'].addClass( 'sb1_lib_open_comment' ) :
    ATTR['body'].removeClass( 'sb1_lib_open_comment' );
}

function clickOnSB1libCollectionItemBox( data ) {
  var current = data['current'], mode = 'sb1_lib_selected';
  var item    = current.closest('.sb1_lib_collection_item');
  if ( ! item.size() ) return;

  var has = item.hasClass( mode );
  if ( has ) {
    item.removeClass( mode );
  }
  else {
    item.addClass( mode );
  }
}

function clickOnSB1libCollectionItemDownload( data ) {
  return;
}


function clickOnSB1libCollectionExpander( data ) {
  var current = data['current'], mode = 'sb1_lib_open';
  var wrapper = current.closest('.sb1_lib_collection_wrapper');
  //wrapper.toggleClass( mode );
  var id = getRule( wrapper )['id'] || wrapper.attr('id');
  var has = wrapper.hasClass( mode );
  if ( has ) {
    wrapper.removeClass( mode );
    _removeAppender();
  }
  else {
    if ( ATTR['appender'] && ATTR['appender']['current'] )
      ATTR['appender']['current'].removeClass( mode );
    wrapper.addClass( mode );
    setupSectionAppender({
      'main'     : wrapper.parent(),
      'current'  : wrapper,
      'margin'   : [0,0],
      'itemname' : '.sb1_lib_collection_wrapper',
      'classname': 'sb1_lib_collection_detail',
      'content'  : ATTR['reference']['child'][id]
    });
  }
}

function clickOnSB1libSearchIdea( data ) {
  var current = data['current'], parent = current.parent(), mode = 'show_idea';
  if ( ! current.hasClass(mode) ) {
    data['parent'] = parent.addClass( mode );
    data['rm']     = mode;
    if ( ATTR['body'].hasClass('search_field_on_focus') )
      ATTR['searchField'].focus();
    return 1;
  }
  return;
}

function clickOnSB1libSearchUndo( data ) {
  if ( ATTR['searchField'] ) { 
    ATTR['searchField'].prop('value','').focus();
    searchInitializing('');
  }
}

function hashChangeEvent( e ) {
  if ( ATTR['hashTimer'] ) clearTimeout(ATTR['hashTimer']);
  ATTR['hashTimer'] = setTimeout( function() {
    if ( ! ATTR.notVerifyURL ) verifyURLoption( true );
  }, 200 );
}

function clickOnSB1libHeader(data) {
  if ( ATTR['body'].hasClass('sb1_lib_show_information') )
    ATTR['body'].removeClass('sb1_lib_show_information');
}

function clickOnSB1libNavigation( data ) {
  clickOnSB1libCollectionItem( data ); 
}

function clickOnSB1libCollectionItem( data ) {
  clickOnSB1libBreadcrumbLink( data );
}

function displayInformationById( id, type, delay ) {
  delay ? setTimeout( function() {
    displaySB1libLibrary( [ATTR['reference']['path'][id]] );
  }, 50 ) : displaySB1libLibrary( [ATTR['reference']['path'][id]] );
}

function getInformationNavigation( data ) {
  var matched = {}, index = null, out = [];

  if ( ATTR['searchField'].prop('value') ) {
    matched = ATTR['reference']['matched'] || {}; 
    index   = parseInt( matched['path'][data['id']] );    
  }
  else {
    var path   = ATTR['reference']['path'];
    var parent = (data['_parent'] || '').split(';;').pop();
    if ( path[parent] ) {
      matched = {'list': path[parent]['content']}, index = data['_index'];
    }
  }

  if ( isNaN(index) ) return out.join('');

  var list = matched['list'] || [], name = '', text = '', type = '', rule = '';
  if ( list[index-1] ) {
    text = list[index-1]['name'] || '',  type = 'sb1_lib_navigation_previous';
    rule = '{\'id\':\''+list[index-1]['id']+'\'}';
  } else {
    text = '', type = 'sb1_lib_navigation_previous sb1_lib_disabled', rule = '';
  }
  name = '<span class="sb1_lib_name">'+(text || '---')+'</span>';
  out.push('<a href="#" data-rule="'+rule+'" class="'+type+'"  title="'+text+'">'+name+'</a>');

  name = (index+1)+'/'+list.length;
  rule = '{\'id\':\''+list[index]['id']+'\'}';
  out.push( '<span class="sb1_lib_navigation_label" data-rule="'+rule+'">'+name+'</span>');

  if ( list[index+1] ) {
    text = list[index+1]['name'] || '',  type = 'sb1_lib_navigation_next';
    rule = '{\'id\':\''+list[index+1]['id']+'\'}';
  } else {
    text = '', type = 'sb1_lib_navigation_next sb1_lib_disabled', rule = '';
  }
  name = '<span class="sb1_lib_name">'+(text || '---')+'</span>';
  out.push('<a href="#" data-rule="'+rule+'" class="'+type+'" title="'+text+'">'+name+'</a>');

  return '<div class="sb1_lib_navigation_wrapper">'+
    '<div class="sb1_lib_navigation_content">'+out.join('')+'</div>' +
  '</div>';
}

function getDataInformation( data ) {
  if ( ! data ) return;
  var detail = data['detail'] || [], out = [], tagBtn = 'sb1_lib_tag_filter_btn';
  for (var i=0; i<detail.length; i++ ) {
    var name = '<h2 class="sb1_lib_headline">'+detail[i]['name']+'</h2>';
    var row  = detail[i]['row'] ||  detail[i]['tab'] || [detail[i]]; 
    var loop = row.length, note = '', header = ''; 
    var isTab =  detail[i]['tab'] ? true : false;

    for ( var j=0; j<loop; j++ ) {
      if ( row[j]['description'] ) {
        note += '<div class="sb1_lib_description">'+row[j]['description']+'</div>';
      }
      else if ( row[j]['code'] ) {
        note += '<div class="sb1_lib_code_wrapper sb1_lib_open">'+
          '<ul class="sb1_lib_code_tool_wrapper">'+
            //'<li class="sb1_lib_item"><a href="#" class="sbl1_lib_code_copy sb1_lib_icon_button sb1_lib_copy" title="Kopiere"></a></li>'+
            '<li class="sb1_lib_item"><a href="#" class="sbl1_lib_code_select_all sb1_lib_icon_button sb1_lib_select_all" title="Markere kodene"></a></li>'+
            '<li class="sb1_lib_item"><a href="#" class="sbl1_lib_code_toggler sb1_lib_icon_button arrow_expander"></a></li>'+
          '</ul>'+
          '<div class="sb1_lib_code"><pre class="brush: js;">'+row[j]['code']+'</pre></div>'+
        '</div>';
      }
      else if ( row[j]['iframe'] ) {
        var approved = data['approved'] ? 
          '<div class="sb1_approved_wrapper"><div class="sb1_approved" title="Godkjent: '+data['approved']+'"><div>Godkjent</div><div>'+data['approved']+'</div></div></div>' : '';
        var landing = '<a href="'+row[j]['iframe']+'" class="sb1_lib_landing_page" target="_blank" title="To landing page">Til demo</a>';
        note += '<div class="sb1_lib_iframe_wrapper'+(j==0?' sb1_lib_open' : '')+'">'+ approved + landing +
          '<iframe src="'+row[j]['iframe']+'" class="sb1_lib_iframe_result" onload="javascript:setupIframe(this)" height="10"></iframe>'+
        '</div>';
      }

      if ( isTab ) {
        header += '<li class="sb1_lib_tab_item'+(j==0?' sb1_lib_open' : '')+'">'+
          '<a href="#" class="sb1_lib_tab_link">'+(row[j]['name'] || '---')+'</a>'+
        '</li>';
      }
    }

    loop < 2 ? out.push( name + note ) : out.push(
      name + '<div class="sb1_lib_'+(isTab ? 'tab':'row')+'_wrapper count_'+loop+'">'+( 
        ! isTab ? note : 
          ('<ul class="sb1_lib_tab_controller">'+header+'</ul><div class="sb1_lib_tab_content">'+note+'</div>')
      ) +'</div>'
    );
  }

  var description = data['description'], tag = ! data['_tag'] ? '' : 
    '<a href="#" class="'+tagBtn+'">'+data['_tag'].join('</a><a href="#" class="'+tagBtn+'">')+'</a>';  

  var style  = 'sb1_lib_item_on_view'+(data['_type'] ? ' '+data['_type'] : '');
  var rating =  _getRatingHTML( data ) || '';


  return '<article class="sb1_lib_collection_wrapper sb1_lib_item_detail">' +  
    getInformationNavigation( data ) + 
    '<div class="'+style+'">'+
      '<h1 class="sb1_lib_headline">' +data['name']+'</h1>'+ 
      (tag ? '<div class="sb1_lib_tag_wrapper">'+tag +'</div>' : '') +
      _getRatingHTML( data ) +
      _getResponsibleHTML( data ) +
      (description? '<div class="sb1_lib_description">'+description+'</div>' : '') +
      (out.length ? '<div class="sb1_lib_content">'+out.join('')+'</div>'  : '')+
    '</div>' +
  '<article>';
}

function showSB1BreadcrumbLinkOption( data ) {
  var current = data['current'], parent = current.parent();
  var id = getRule( current )['id'], path = ATTR['reference']['path'];
  if ( ! id || ! path[id] ) return;

  var check  = path[id]['_parent'], mode = 'sb1_lib_show_link_widget';
  var widget = parent.find('> .sb1_lib_widget'), out = [], pin = {};
  if ( widget.size() ) widget.remove();

  parent.find('> .sb1_lib_breadcrumb_link').each( function(i,dom){
    var node = $(dom), id = getRule( node )['id'];
    if ( ! id || pin[id] || ! path[id] || path[id]['_parent'] != check ) return;
    pin[id] = true;
    out.push( dom.outerHTML.replace( /(\s+)?id\=\"[\w\_\-]+\"/g, '') );
  });

  $('<div class="sb1_lib_widget">'+out.join('')+'</div>').appendTo( parent );
  if (! current.attr('id') ) current.attr('id', generateId());

  data['parent'] = parent.addClass( mode );
  data['rm']     = mode;
  return 1;
}

function toggleAllDescription( hide ) {
  var mode = 'sb1_lib_hide_all_description';
  hide ? ATTR['body'].addClass( mode ) : ATTR['body'].removeClass( mode );
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

function getIframeBodyText( iframe ) {
  if ( ! iframe ) return '';

  var doc = iframe.contentDocument ? 
    iframe.contentDocument : iframe.contentWindow.document;
  if ( ! doc ) return '';

  var iWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
  var body = iWin.document.body  || doc.body;
  return body ? (body.innerHTML || '') : '';
}

function setIframeBodyText( iframe, text ) {
  if ( ! iframe ) return '';

  var doc = iframe.contentDocument ? 
    iframe.contentDocument : iframe.contentWindow.document;
  if ( ! doc ) return '';

  var iWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
  var body = iWin.document.body  || doc.body;
  if ( body ) body.innerHTML = text || '';
}

function getBreadcrumb( data ) {
  var out  = [], parent = data ? (data['_parent'] || '') : '', rule = '';
  var spl  = parent.split(';;'), path = ATTR['reference']['path'];
  var type = 'sb1_lib_breadcrumb_link';

  for ( var i=0; i<spl.length; i++ ) {
    if ( ! path[spl[i]] || ! path[spl[i]]['name'] ) continue;
    rule = '{\'id\':\''+spl[i]+'\'}';
    out.push( 
      '<li class="sb1_lib_breadcrumb_item">' +
        '<a href="#" class="'+type+'" data-rule="'+rule+'">'+
          capitaliseFirstLetter(path[spl[i]]['name'])+
        '</a>'+
      '</li>' 
    );
  }

  return ! out.length ? '' : 
    '<ul class="sb1_lib_breadcrumb_wrapper">'+out.join('')+'</ul>';
}

function resetYourCommentNewText() {
  var iframe = ATTR['commentPlace'].find('iframe'), text = '';
  if ( iframe.size() ) text = getIframeBodyText( iframe.get(0) );
  setIframeBodyText( iframe.get(0), '' );
}

function getYourCommentNewText() {
  var iframe = ATTR['commentPlace'].find('iframe'), text = '';
  if ( iframe.size() ) text = getIframeBodyText( iframe.get(0) );

  if ( text ) {
    text = text.replace( /<br[\s\w\-\_\=\"\/\d]+\>/g, '')
      //.replace( /<[^\/>][^>]*><\/[^>]+>/g, '' );
      .replace( /(<(?!\/)[^>]+>)+(<\/[^>]+>)+/g, '' );
  } else {
    var area = ATTR['commentPlace'].find('textarea');
    text = area.size() ? (area.prop('value') ||'') : ''
  } 
  return text;
}

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

    //debug('K:'+key+' T:'+text, ' O:'+out.join('&'));

    window.location.hash = '?'+out.join('&');
    ATTR['history'] = [];
  }, 200 );


  /*
  if ( ! key ) return;
  var opts = getURLoption(), out = [];
  opts[key] = text || null;
  for ( var k in opts ) {
    if ( k !='pathname' && opts[k] ) out.push( k+'='+opts[k] );
  }
  window.location.hash = '?'+out.join('&');
  */
  //var opts = getURLoption(), out = [];
  //updateWindowHistory( 'display', first['_level'] ? first['id'] : null ); 
}

function getSB1date( separation ) {
  var d = new Date(), l = [d.getFullYear(), d.getMonth()+1, d.getDate()];
  for ( var i=0; i<l.length; i++ ) {
    if ( l[i] < 10 ) l[i] = '0'+l[i];
  } 
  return l.join( separation || '.' );
}

function verifyLogin() {
  if ( ! ATTR['api']['authentication'] ) return;

  var usr = $('#sb1_lib_usr_field'), pwd = $('#sb1_lib_pwd_field'), btn = $('#sb1_lib_login');
  var msg = $('#sb1_lib_login_error'), out = [], data = {
    'UserName'  : usr.prop('value') || '',
    'Password'  : pwd.prop('value') || '',
    'RememberMe':false
  };

  if ( ! data['UserName'] ) out.push('brukernavn mangler');
  if ( ! data['Password'] ) out.push('passord mangler');

  if ( out.length ) 
    return msg.html( capitaliseFirstLetter(out.join(' og ')) );

  usr.attr('disabled', 'true').addClass('sb1_lib_disabled');
  pwd.attr('disabled', 'true').addClass('sb1_lib_disabled');
  btn.addClass('sb1_lib_disabled');

  msg.html( _getSpinnerHTML() );
  
  $.ajax({'type':'POST','url':ATTR['api']['authentication'],'data':data,'success':function (s) {
    usr.removeAttr('disabled').removeClass('sb1_lib_disabled');
    pwd.removeAttr('disabled').removeClass('sb1_lib_disabled');
    btn.removeClass('sb1_lib_disabled');

    if ( ! s ) 
      msg.html( 'ERROR BACKEND' );
    else if ( ! s['success'] )
      msg.html( 'Feil brukernavn eller passord.');
    else {
      ATTR['body'].removeClass( 'sb1_lib_need_authentication' );
      createCookie( ATTR['cookie']+'_token', '1', 365 );
      reveal();
    }
  }});
}

function getStartupComment( id ) {
  if ( ! id ) return;
  var conf = ATTR['featureComment'] || {};
  var url  = ATTR['api']['commentCount']+'/'+id;

  ATTR['reference']['comment'][id] = [];
  ATTR['reference']['comment']['_count_'+id] = 0;
  $.ajax({'type':'GET','url':url,'success':function (s) {
    if ( ! s || ! s['count'] ) { 
      ATTR['reference']['comment'][id+'_done'] = true;
      return;
    }
  
    ATTR['reference']['comment']['_count_'+id] = s['count'];

    var sum = conf['startView']+(conf['gapView'] || 0);
    if ( sum < s['count'] ) sum = conf['startView'];

    url = ATTR['api']['commentList']+'/'+id+'/0/'+sum;
    $.ajax({'type':'GET','url':url,'success':function (s) {  
      ATTR['reference']['comment'][id] = s || [];
      ATTR['reference']['comment'][id+'_done'] = true;
    }});
  }});
}

function createDummyComment( id ) {
  var count = Math.floor((Math.random() * 40) + 0), cnt = [];
  var text  = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Aenean eu justo et turpis posuere tempor.',
    'vitae odio sed mauris feugiat iaculis. Praesent sed ullamcorper urna, sit',
    'Cras in nunc faucibus, dictum ex sed,',
    'vitae elit accumsan, nec facilisis nibh congue. Curabitur ornare vel nisi',
    'Sed iaculis nibh sit amet fermentum consectetur. Vestibulum ante ipsum primis in faucibus.',
    'Etiam eleifend ligula molestie erat maximus dictum in quis arcu.',
    'Etiam ac pretium sem, ut suscipit mi.',
    'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae'
  ];

  for ( var i=0; i<count; i++ ) {
    var t = Math.floor((Math.random() * text.length) + 0), out = [], pin = {};
    for ( var j=0; j<=t; j++ ) {
      var index = Math.floor((Math.random() * text.length) + 0);
      if ( pin[index+''] ) continue;
      pin[index+''] = true;
      out.push( text[index]);
    } 
    cnt.push( {
      'id': (new Date).getTime()+'_'+count,
      'by': 'ABC Nilsen',
      'time': i==0 ? '29.10.2014' : '01.10.2014',
      'text': out.join(' ')
    });
  }
  ATTR['reference']['comment'][id] = cnt; 
}

function updateFilterVisibility( ignorCreatingCookie ) { 
  clearTimeout( ATTR['updateFilterVisibilityTimer'] || 0 );
  ATTR['updateFilterVisibilityTimer'] = setTimeout( function() {
    var mode = 'not_in_view', filter = [], pin = {};
    var all = ATTR['header'].find( '.sb1_lib_filter_btn.visibility').each( function(i,dom) {
      var node = $(dom), rule = node.attr('data-rule') || '';
      if ( node.hasClass( mode ) ) {
        ATTR['body'].removeClass( rule ); 
        pin[rule] = 0;
      }
      else { 
        pin[rule] = 1;
        ATTR['body'].addClass( rule );
      }
    });

    if ( ! ignorCreatingCookie )
      createCookie( 'sb1_lib_visibility', JSON.stringify(pin), 365);
    //updateWindowHistory( 'visibility', filter.length ? filter.join(';') : null );
  }, 30 );
}

function _getSpinnerHTML() {
  return '<span class="sb1_spinner">'+
    '<i class="spinner_rect1"></i>'+
    '<i class="spinner_rect2"></i>'+
    '<i class="spinner_rect3"></i>'+
    '<i class="spinner_rect4"></i>'+
    '<i class="spinner_rect5"></i>'+
  '</span>';
}

function _uploadStatisticData( callback) {
  var name = ATTR['cookie']+'_visitor', url = ATTR['api']['statistic_visitor'];
  if ( readCookie(name) || ! url ) 
    return typeof(callback)=='function' ? callback() : null;

  var out = [], ie = isIE(), checkList = {
    'Firefox' : isMozilla(),
    'Chrome'  : isChrome(),
    'Opera'   : isOpera(),
    'Safari'  : isSafari(),
    'IE9'     : ie == 9,
    'IE10'    : ie == 10,
    'IE11'    : ie == 11,
    'IE12'    : ie == 12
  };

  if ( checkList['Opera'] ) {
    checkList['Chrome'] = false; checkList['Safari'] = false;
  } 
  else if ( checkList['Chrome'] && window.chrome ) {
    checkList['Safari'] = false; checkList['opera'] = false;    
  }
  else if ( checkList['Safari'] ) {
    checkList['Chrome'] = false; checkList['opera'] = false;
  }

  for ( var k in checkList ) {
    if ( checkList[k] ) out.push('browser='+k);
  }
  if ( ! out.length ) out.push('browser=Andre');
  if ( isTouchDevice() ) out.push('touch=1');

  var now  = new Date();
  var next = new Date( now.getFullYear(), now.getMonth(), now.getDate()+1,0,0,0);
  var left = parseFloat( ((next.getTime()-now.getTime())/(1000*60*60*24)) );
  createCookie( name, 1, left );
  //$.ajax({'type':'GET','url':url,'data':out.join('&'),'success': function (s) {
  $.ajax({'type':'GET','url':url+'&'+out.join('&'),'success': function (source) {
    if ( typeof(callback) == 'function' ) callback();
  }});
}

function _displayStatisticData( callback ) {
  var url = ATTR['api']['statistic_data'];
  if ( ! url || ! ATTR['statisticHolder'] ) 
    return typeof(callback)=='function' ? callback() : null;

  $.ajax({'type':'GET','url':url,'success': function (source) {
    var parsed  = JSON.parse( source || '{"result":[]}' );
    var list    = parsed['result'] || [], loop = list.length, now = new Date();
    if ( loop > 60 ) loop = 60;

    var browser = ['Chrome','Firefox','Safari','Opera','IE9','IE10','IE11','IE12','Andre'];
    var bLoop   = browser.length, row = [];

    for ( var i=0; i<loop; i++ ) {
      var data = list[i], matched = data['date'].match( /(\d{4})(\d{2})(\d{2})/ );
      var date = new Date( data['timestamp'] ), cell = [
        '<td class="first_column"><span>'+
          ATTR['day'][date.getDay()] +' ('+
          matched[3]+'.'+matched[2] +
          (parseInt(matched[1])==now.getFullYear() ? '': '.'+matched[1])+
        ')</span></td>'
      ]; 

      var sum = 0, touch = 0, notTouch= 0;
      for ( var j=0; j<bLoop; j++ ) {
        var n = browser[j], v = data[n], s = 0, t = '';
        for ( var x=0; x<v.length; x++ ) {
          s += v[x]
          if ( x ) {
            t += ', touch device: '+v[x];
            touch += v[x];
          }
          else {
            t += 'Not touch device: '+v[x];              
            notTouch += v[x];
          }
        }
        sum += s;
        cell.push( '<td><span title="'+t+'">'+s+'</span></td>');
      }
      cell.push( 
        '<td class="last_column"><span title="Not touch device: '+
        notTouch+', touch device:'+touch+'">'+sum+'</span></td>'
      );      
      row.push('<tr>'+cell.join('')+'</tr>');
    }

    if ( row.length ) {
      var header = ['<th class="first_column"><span>Dato</span></th>'];
      for ( var j=0; j<bLoop; j++ ) {
        var n = browser[j], c = 'sb1_lib_browser type_'+n.toLowerCase();
        header.push('<th><span class="'+c+'">'+n+'</span></th>'); 
      }
      header.push('<th class="last_column"><span>Totalt</span></th>'); 
      
      ATTR['statisticHolder'].html( 
        '<table class="sb1_statistic_table">' +
          '<tr>'+header.join('')+ '</tr>'+row.join('')+
        '</table>'
      );
    } else { ATTR['statisticHolder'].html('none'); }

    if ( typeof(callback)=='function' ) callback();
  }});
}

function ratingInOut( e ) {
  clearTimeout( ATTR['ratingTimer'] || 0 );
  var node = $(e.currentTarget), parent = node.parent(), top = parent.closest('.sb1_content');
  var summary = top.find('.summary'), all = parent.children(), loop = all.size();
  if ( e.type == 'mouseover' ) {
    parent.addClass('on_over');
    var index = all.index( node );
    for ( var i=0; i<loop; i++ ) {
      i <= index ? all.eq(i).addClass('on_over') : all.eq(i).removeClass('on_over');
    }
    if ( summary.size() ) summary.html( (index+1)+' / '+loop  );
  }
  else {
    ATTR['ratingTimer'] = setTimeout( function() {
      parent.removeClass('on_over');
      all.removeClass('on_over');
      if ( summary.size() ) { 
        var loop = all.size(), index = all.index(all.filter('.on_selected').last());
        summary.html( ((index+1) || '-')+' / '+loop  );
      }
    }, 100 );
  }
}

function _getRatingHTML( data ) {
  var loop = ATTR['featureRating'];
  if ( ! loop ) return '';
  var category = data['category'] || '', pin = {};
  if ( typeof(category)=='string' ) 
    pin[category] = true;
  else
    pin = category['pin'];

  if ( ! pin['solution'] ) return '';

  var out = [];
  for ( var i=0; i<loop; i++ ) { 
    out.push('<a href="#" class="sb1_lib_rating"></a>');
  }

  return '<div class="sb1_lib_rating_wrapper">'+
    '<ul class="sb1_lib_rating_private">'+
      '<li class="sb1_lib_governance">'+
        '<div class="sb1_content">'+
          '<div class="value"><span>8,5</span></div>'+
          '<div class="label">Governancepanelet sier</div>'+
          '<div class="table_holder">'+
            '<div class="cell">'+
              '<div class="text">Veldig bra!</div>'+
              '<div>'+
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '+
                'Sed porta leo et lectus lobortis, ac vulputate arcu porta. '+
                'Suspendisse ut mi volutpat, suscipit tellus et, tristique tellus. '+
                'Phasellus vel condimentum massa, vitae vulputate nisl'+
              '</div>'+
            '</div>'+
            '<div class="cell">'+
              '<ul class="positive">' +
                '<li>Nullam convallis vitae purus sit amet semper. Sed porta leo et lectus lobortis, ac vulputate arcu porta.</li>'+
                //'<li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>'+
                '<li>Proin tincidunt enim eget.</li>'+
              '</ul>' +
              '<ul class="negative">' +
                '<li>Proin tincidunt enim eget.</li>'+
                '<li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>'+
                //'<li>Nullam convallis vitae purus sit amet semper. Sed porta leo et lectus lobortis, ac vulputate arcu porta.</li>'+
              '</ul>' +
            '</div>'+
          '</div>' +
        '</div>'+
      '</li>'+
    '</ul><ul class="sb1_lib_rating_public">'+
      '<li class="sb1_lib_alliance">'+
        '<div class="sb1_content">'+
          '<div class="label">Alliansens karakter</div>'+        
          '<div class="text"><span class="character">7,2</span> <span class="normal voter">12 stemmer</span></div>'+
        '</div>'+
      '</li>'+   
      '<li class="sb1_lib_personal">'+
        '<div class="sb1_content">'+
          '<div class="label"><span>Din karakter</span> <span class="summary">- / '+loop+'</span></div>'+    
          '<div class="rating_holder">'+        
            '<div class="rating">'+out.join('')+'</div>'+
            //'<div class="summary">- / '+loop+'</div>'+
          '</div>' +
        '</div>'+
      '</li>'+   
    '</ul>'+
  '</div>';
}

function _getResponsibleHTML( data ) {
  var name = data['responsible_name'];
  if ( ! name ) return '';

  var phone = data['responsible_phone'], email = data['responsible_email']; 
  var where = data['responsible_department'];  
  var headline = data['responsible_headline'] || 'Ansvarlig';

  return '<div class="sb1_lib_responsible_wrapper">' +
    '<h2 class="sb1_lib_headline">'+headline+'</h2>'+
    '<div class="responsible_name">'+
      ( email ? 
        '<a href="mailto:'+email+'" class="email" title="'+email+'">'+name+'</a>' : 
        '<span class="name">'+name+'</span>'
      )+
      (phone ? '<a href="tel:'+phone.replace(/\s+/g,'')+'" class="phone">'+phone+'</a>' : '')+
    '</div>'+
    (where ? '<div class="responsible_department">'+where+'</div>' : '') +
  '</div>';
}


/******************************************/

function setupSectionAppender( opt ) {
  _removeAppender();
  ATTR['appender'] = opt;
  if ( ! opt || ! opt['current'] || ! opt ['current'].size() ) return;

  var item = _getAppenderItem();
  if ( ! item.size() ) return;

  if ( ! opt['tag'] ) opt['tag'] = item.eq(0).prop('tagName');

  if ( opt['tag'].toLowerCase() == 'a' ) opt['tag'] = 'div';

  var type = 'sb1_section_appender' + (opt.classname ? ' '+opt.classname : ''); 
  var style = 'width:100%;clear:both;', appender = opt['appender'] || $(
    '<'+opt['tag']+' class="'+type+'" style="'+style+'">'+opt['content']+'</'+opt['tag']+'>'
  );

  opt['appenderId'] = generateId( appender );
  opt['target']     = _getAppendingTarget( item );
  appender.insertAfter( opt['target'] );
  opt['main'].addClass('sb1_section_appender_conatiner');
}

function _removeAppender() {
  var appender = _getAppender();
  if ( appender ) appender.remove();  
}

function _getAppender() { 
  return ATTR['appender'] ? $('#'+ATTR['appender']['appenderId'] ) : null; 
};

function _getAppenderItem () {
  var mode = 'sectionAppenderPinTarget', opt = ATTR['appender'];
  if ( ! opt ) return;

  var item = opt['main'].find( opt['item'] || ('> ' +(opt['itemname'] || '*')) )
    .not('.sb1_section_appender').each( function(i,dom){
    var n = $(dom), w = n.prop('offsetWidth');
    if ( w ) n.addClass( mode );
  }).filter( '.'+mode );
  return item.removeClass( mode );
};

function _renewCurrentTarget( target ) {
  var opt = ATTR['appender'];
  if ( ! target || ! target.size() || ! opt ) return;

  var index = opt['item'].index( target );
  if ( index < 0 ) return;
  opt['current'] = target;
};

function _getAppendingTarget( item ) {
  var opt = ATTR['appender'];
  if ( ! opt ) return; 

  if ( ! item ) item = _getAppenderItem();
  var max    = opt['main'].prop('offsetWidth'), first = opt['current']; 
  var margin = opt.margin || [
    parseFloat(first.css('margin-left')  || '0'), 
    parseFloat(first.css('margin-right') || '0')
  ];

  var size  = first.prop('offsetWidth') + margin[0] + margin[1];
  var index = parseInt(max/size)-1, current = item.index( opt['current'] );
  var count = item.size(), cRow = parseInt(max/size);

  if ( index < current ) index = current;
  if ( index >= count  ) index = count-1;      
  else if ( index < 0  ) index = 0;

  var left = (index+1)%cRow;
  if ( left ) {
    index += (cRow-left);
    if ( index >= count  ) index = count-1;      
  }

  var target = item.eq( index );
  generateId( target );
  return target;
};

function _resizeAppender( e ) {
  var opt = ATTR['appender'], appender = _getAppender();
  if ( ! opt || ! appender || ! appender.size() ) return;

  var now = opt['target'], target = _getAppendingTarget();

  opt['current'].prop('offsetWidth') ? 
    appender.removeClass('sb1_hide') : appender.addClass('sb1_hide');

  if ( now.attr('id')==target.attr('id') ) return;

  opt['target'] = target;
  appender.insertAfter( opt['target'] );
}
