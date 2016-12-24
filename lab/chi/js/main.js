/******************************************************************************
=== GLOBAL ATTRIBUTE ===
******************************************************************************/
try { CONFIG; } catch( error ){ CONFIG = {};   }
try { HOMEGALLERY; } catch( error ){ HOMEGALLERY = null;   }
try { MENUGALLERY; } catch( error ){ MENUGALLERY = null;   }
try { MENU; } catch( error ){ MENU = [];   }
try { GALLERY; } catch( error ){ GALLERY = [];   }
try { MAPSTYLING; } catch( error ){ MAPSTYLING = [];   }

var ATTR = {
  'timeout'  : 0,
  'interval' : 0,
  'now'      : new Date()
};

/******************************************************************************
=== MAIN GLOBAL FUCNTION ===
******************************************************************************/
function initMap() {
  var center = {lat: 59.958088, lng: 11.049032};

  var map = new google.maps.Map(document.getElementById('map'), {
    'center': center,
    'scrollwheel': false,
    'zoom': 15,
    'styles': MAPSTYLING
  });

  var marker = new google.maps.Marker({
    'position': center,
    'map': map,
    'title': 'Chi restaurant & bar, Parkalleén 3'
  });
}

function startup() {
  initHomeGallary();
  //initMenuGallary();
  initHome();
  initMenu();
  initGallery();

  ATTR.tab   = $('.tab-btn.-main');
  ATTR.panel = $('.tab-panel.-main');

  ATTR.tabMenu   = $('.tab-btn.-menu');
  ATTR.panelMenu = $('.tab-panel.-menu');


  $( document ).on('click', clickHandler);
  $( window ).on('hashchange', hashChangeHandler);

  hashChangeHandler();
}

function initHomeGallary() {
  var homeGallery = $('#home-gallary');
  if ( homeGallery.length ) {
    if ( HOMEGALLERY ) {
      homeGallery.Carousel( HOMEGALLERY );
    } else {
      homeGallery.remove();
      $('body').addClass('no-home-gallery');
    }
  }  
}

function initMenuGallary() {
  var menuGallery = $('#menu-gallary');
  if ( menuGallery.length ) {
    if ( MENUGALLERY ) {
      menuGallery.Carousel( MENUGALLERY );
    } else {
      menuGallery.remove();
      $('body').addClass('no-menu-gallery');
    }
  }
}

function initHome() {
}

function initMenu() {
  var list = [], index = 0, i = 0;
  for ( i=0; i<MENU.length; i++ ) {
    var data = MENU[i];
    if ( data.category ) {
      list[index++] = { 'name': data.category, 'content': [] };
    } else if ( list[index-1] ) {
      list[index-1].content.push( _createFoodMenu(data) );
    }
  }

  console.log( list );

  var output = [], category = [];
  for ( i=0; i<list.length; i++ ) {
    var id = 'm-'+list[i].name.substring(0,3) + i; 
    var type = '-menu' + (i ? '' : ' -show');
    category.push( 
      '<a href="#'+id+'" role="tab" id="tab-menu-'+id+'" aria-selected="false" aria-controls="panel-menu'+id+'" class="tab-btn '+type+'">'+
        list[i].name +
      '</a>'
    );
    output.push(
      '<div id="panel-menu-'+id+'" aria-hidden="false" aria-labelledby="tab-menu-'+id+'" class="tab-panel '+type+'">'+
        list[i].content.join('') +
      '</div>'
    );
  }

  $('#a-la-carte-headline').html( 
    '<ul class="tablist" role="tablist">'+
      '<li role="presentation">'+
        category.join('</li><li role="presentation">')+
      '</li>'+
    '</ul>'
  );
  $('#a-la-carte-content').html( output.join('') );
}

function initGallery() {
  var out = [];
  for ( var i=0; i<GALLERY.length; i++ ) {
    out.push(
      '<a href="#" class="gallery-image">' +
        '<img src="'+GALLERY[i].src+'" alt="'+GALLERY[i].alt+'">' +
        '<div class="title ellipsis">' + GALLERY[i].alt + '</div>'+
      '</a>'
    );
  }

  $('#gallery-view').html(
    '<ul class="gallery-list">' +
      '<li>' + out.join('</li><li>') + '</li>' +
    '</ul>'
  );
}

/******************************************************************************
=== EVENT FUCNTION ===
******************************************************************************/
/**
* The function 
* @return {Void}
*/
function hashChangeHandler( e ) {
  var opt = getURLoption();
  changeTab( opt.tab || 'home' );
  changeMenu( opt.menu || 'a-la-carte' );
}

/**
 * @param e {Window.Event}
 * @return {Void}
 */
function clickHandler( e ) {
  var target = $(e.target), parent = target.parent(), order = [
    {'type':'class', 'what':'tab-btn',       'handler':clickOnTabBtn        },
    {'type':'class', 'what':'gallery-image', 'handler':clickOnGalleryImage  },
    {'type':'class', 'what':'close-modal',   'handler':clickOnCloseModal    },
    {'type':'id',    'what':'btnLogo',       'handler':clickOnBtnLogo       }
  ]; 

  var i = 0, loop = order.length, current = null; 
  for ( i; i < loop; i++ ) {
    if ( order[i].type === 'class' ) {
      if ( target.hasClass(order[i].what) ) {
        current = target;
      } else if ( parent.hasClass(order[i].what) ) {
        current = parent;
      }
    } else if ( order[i].type === 'id' ) {
      if ( target.is(order[i].what) ) {
        current = target;
      } else if ( parent.is(order[i].what) ) {
        current = parent;
      }
    }

    if ( current ) {
      e.preventDefault();
      order[i].handler({'e':e, 'current': current});
      i = loop;
    }
  }
}

function clickOnBtnLogo( data ) {  
}


function clickOnCloseModal( data ) {
  hideModal();
}

function clickOnTabBtn( data ) {
  var href = data.current.attr('href');
  if ( ! href ) { return; }

  if ( data.current.hasClass('-menu-headline') ) {

  } else if ( data.current.hasClass('-menu') ) {
    updateLocationHash({'menu': href.replace( /\#/g, '' )});
  } else {
    updateLocationHash({'tab': href.replace( /\#/g, '' )});
  }
}

function clickOnGalleryImage( data ) {
  showModal( '<div class="image-cnt">'+data.current.html()+'</div>' );
}

function changeTab( name ) {
  if ( ! name ) { return; }

  ATTR.tab.removeClass('-show');
  ATTR.panel.removeClass('-show');

  ATTR.tab.filter('#tab-'+name).addClass('-show');
  ATTR.panel.filter('#panel-'+name).addClass('-show');

  if ( name === 'menu' && ! ATTR.tabMenu.filter('.-show').length ) {
    ATTR.tabMenu.eq(0).click();
  } else {
    $( window ).resize();
  }
}

function changeMenu( name ) {
  if ( ! name ) { return; }

  ATTR.tabMenu.removeClass('-show');
  ATTR.panelMenu.removeClass('-show');

  ATTR.tabMenu.filter('#tab-menu-'+name).addClass('-show');
  ATTR.panelMenu.filter('#panel-menu-'+name).addClass('-show');
}

function showModal( html ) {
  var close = '<a href="#" class="close-modal" title="Lukk modal vindu">' +
    '<span aria-hidden="true">&#x2716;</span>'+
    '<span class="aria-visible">Lukk modal vindu</span>'+
  '</a>';

  $('#modal').html('<div class="content">' + close + html +'</div>')
    .attr('aria-hidden', 'false').addClass('-open');
  $('body').addClass('display-modal');
}

function hideModal() {
  $('#modal').html('').attr('aria-hidden', 'true').removeClass('-open');
  $('body').removeClass('display-modal');
}

/******************************************************************************
=== GENERAL FUCNTION ===
******************************************************************************/
function updateLocationHash( data ) {
  if ( ! data ) { data = {}; }

  var opt = getURLoption(), key = '', param = [];
  for ( key in data ) {
    opt[key] = data[key];
  }

  for ( key in opt ) {
    if ( opt[key] ) {
      param.push( key+'='+opt[key] );
    }
  }
  window.location.hash = param.length ? ('?'+param.join('&')) : '';
}
 
function getURLoption() {
  var opt = {}, url = window.location.href;
  var matched = url.replace(/\#+/g, '#').match( /^([\w\.\-\s\_\%\/\:]+)\#(.*)/ )
    || url.replace(/\?+/g, '?').match( /^([\w\.\-\s\_\#\%\/\:]+)\?(.*)/ );

  if ( matched ) {
    let splited = (decodeURIComponent(matched[2]) || '')
      .replace( /\#\?/g, '&' ).split( '&' );
    for ( let i = 0; i < splited.length; i++ ) {
      let m = splited[i].match( /(\w+)\=(.*)/ );
      if ( m ) { opt[m[1]] = m[2].replace( /\#$/, '' ); }
    }
  }
  return opt;
}

function getAutoId() {
  var random = Math.floor((Math.random() * 10) + 1);
  var time   = (new Date()).getTime();
  return 'auto_' + time + '_' + random;
}

/******************************************************************************
=== INTERNAL FUCNTION ===
******************************************************************************/
function _createFoodMenu( data ) {
  var html = '', note = data.notification ? 
    '<div class="notification">'+data.notification+'</div>' : '';
    
  if ( data.headline ) {
    var id = getAutoId(); 
    html = '<h2 id="'+id+'">'+data.headline+'</h2>'+note;
  } else if ( data.subline ) {
    html = '<h3>'+data.subline+'</h2>'+note;
  } else {
    var description = data.description ? 
      '<div class="description">'+data.description+'</div>' : '';
    var sashimi = data.sashimi ? 
      '<div class="price sashimi">'+data.sashimi+'</div>' : '';
    var type = 'food' + (data.type ? (' -'+data.type) : '') +
      (sashimi ? ' -has-sashimi' : '');

    html = '<div class="'+type+'">' +
      '<div class="number">'+data.number+'</div>'+
      '<div class="name">'+data.name+'</div>'+
      '<div class="price">'+data.price+'</div>'+
      sashimi + description + note +
    '</div>';   
  }
  return html;
}