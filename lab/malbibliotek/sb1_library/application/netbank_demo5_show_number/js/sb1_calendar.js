/****
 * 
 * The plugin allows to integrate a customizable, 
 * Browser Support Details
 *   - FireFox 5.0+
 *   - Safari 5.0+
 *   - Chrome 19.0+
 *   - Internet Explorer 7+
 *   - Android 2.3+ 
 *   - Opera 12.0+
 *   - iOS Safari 4.0+
 */
;(function($) { $.fn.SB1calendar = function ( config ) {
  if ( ! config ) { config = {}; }

  /****************************************************************************
    === CONFIGURATION OPTION === 
  ****************************************************************************/
  var opt = {
    'main'  : this,
    'active': {},
    'idList': [],
    'timer' : {},
    'now'   : typeof(config.now)==='number' ? (new Date(config.now)) : (new Date()),
    'view'  : typeof(config.view)==='number' ? (new Date(config.view)) : null,
    'bfClickOnShortcutCallback' : config.bfClickOnShortcutCallback,
    'afClickOnShortcutCallback' : config.afClickOnShortcutCallback,
    'bfClickOnDayCallback' : config.bfClickOnDayCallback,
    'afClickOnDayCallback' : config.afClickOnDayCallback,
    'max'   : config.max,
    'min'   : config.min,
    'interval' : config.interval,
    'controller' : config.controller,
    'field'    : config.field,
    'aDay'    : 24*60*60*1000,
    'language' : config.language || 'nb',
    'shortcut' : config.shortcut || [],
    'shortcutW': config.shortcutWrapper,
    'shortcutS': config.shortcutSelectedIndex,
    'pattern'  : /^(0?[1-9]|[12][0-9]|3[01])([\/\-\.])(0?[1-9]|1[012])([\/\-\.])(\d{4})$/, // DD.MM.YYYY
    'label'    :  {
      'month_nb' : ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'],
      'week_nb'  : ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
      'month_nn' : ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'],
      'week_nn'  : ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
      'month_en' : ['January','February','Mars','April','Mai','June','July','August','September','October','November','Desember'],
      'week_en'  : ['Sunday','Monday','Tuesday','wednesday','Thursday','Friday','Saturday'],
      'get_calendar_en'  : 'get calendar',
      'get_calendar_nb'  : 'hent kalender',
      'get_calendar_nn'  : 'hent kalender',
      'shortcut_last_en'  : 'Last',
      'shortcut_last_nb'  : 'Siste',
      'shortcut_last_nn'  : 'Siste',
      'shortcut_last_day_en' : 'Day',
      'shortcut_last_day_nb' : 'Døgn',
      'shortcut_last_day_nn' : 'Døgn',
      'shortcut_last_week_en' : 'Week',
      'shortcut_last_week_nb' : 'Uke',
      'shortcut_last_week_nn' : 'Uke',
      'shortcut_last_month_en' : 'Month',
      'shortcut_last_month_nb' : 'Måned',
      'shortcut_last_month_nn' : 'Måned',
      'shortcut_from_en'  : 'from',
      'shortcut_from_nb'  : 'f.o.m',
      'shortcut_from_nn'  : 'f.o.m',
      'shortcut_about_en'  : 'Next',
      'shortcut_about_nb'  : 'Neste',
      'shortcut_about_nn'  : 'Neste',
      'shortcut_about_day_en'  : 'Day',
      'shortcut_about_day_nb'  : 'dag',
      'shortcut_about_day_nn'  : 'dag',
      'shortcut_about_week_en' : 'Week',
      'shortcut_about_week_nb' : 'Uke',
      'shortcut_about_week_nn' : 'Uke',
      'shortcut_about_month_en' : 'Month',
      'shortcut_about_month_nb' : 'Måned',
      'shortcut_about_month_nn' : 'Måned',

      'shortcut_day_en'  : 'Today',
      'shortcut_day_nb'  : 'I dag',
      'shortcut_day_nn'  : 'I dag',
      'shortcut_day-1_en'  : 'Yesterday',
      'shortcut_day-1_nb'  : 'I går',
      'shortcut_day-1_nn'  : 'I går',
      'shortcut_day+1_en'  : 'Tomorrow',
      'shortcut_day+1_nb'  : 'I morgen',
      'shortcut_day+1_nn'  : 'I morgen',

      'shortcut_week_en'  : 'This week',
      'shortcut_week_nb'  : 'Denne uken',
      'shortcut_week_nn'  : 'Denne uken',
      'shortcut_week-1_en'  : 'Last week',
      'shortcut_week-1_nb'  : 'Forrige uke',
      'shortcut_week-1_nn'  : 'Forrige uke',
      'shortcut_week+1_en'  : 'Next week',
      'shortcut_week+1_nb'  : 'Neste uke',
      'shortcut_week+1_nn'  : 'Neste uke',

      'shortcut_month_en'  : 'This month',
      'shortcut_month_nb'  : 'Denne måneden',
      'shortcut_month_nn'  : 'Denne måneden',
      'shortcut_month-1_en'  : 'Last month',
      'shortcut_month-1_nb'  : 'Forrige måned',
      'shortcut_month-1_nn'  : 'Forrige måned',
      'shortcut_month+1_en'  : 'Next month',
      'shortcut_month+1_nb'  : 'Neste måned',
      'shortcut_month+1_nn'  : 'Neste måned',
      '':''
    },
    'displayTable' : typeof(config.displayTable)==='number' ? config.displayTable : 1
  };

  var helper = {

    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      if ( ! opt.controller || ! opt.controller.size() ) { return; }

      helper.setupNowDate();
      helper.setupMaxMinDate();
      helper.setupController();
      helper.setupWeekMonthLabel();
      helper.setupStartCalender();
      helper.setupShortcut( opt.shortcut, opt.shortcutW, opt.shortcutS );

      opt.widget.on('click', helper._click );
      $( window ).off('resize', helper._resize ).on('resize', helper._resize );
      //helper.setInterval([new Date(1431036000000),new Date(1431208800000)]);
    },

    setupShortcut : function( shortcut, where, selectedIndex ) {
      if ( ! shortcut ) { return; }

      var cnt = [], list = shortcut || [], loop = list.length;
      for ( var i=0; i<loop; i++ ) {
        if ( typeof(list[i])==='object' && list[i].label ) {
          var type = 'sb1_calendar_shortcut_item'+(list[i].type ? ' '+list[i].type: '');    
          cnt.push( '<a href="#" class="'+type+'"><span>'+list[i].label+'</span></a>');
        } 
        else {
          var m = list[i].match(/(day|week|month)((\+|\-)\d+)?/i);
          if ( ! m ) { continue; }

          var n = m[2] ? parseFloat(m[2]) : null; 
          var b = m[1].match( /[A-Z]+/ ) ? true : false;
          var t = m[1].match(/day/i) ? helper._getShortcutDay(n,b) : 
            (m[1].match(/week/i) ? helper._getShortcutWeek(n,b) : helper._getShortcutMonth(n,b));
          if ( t ) { cnt.push(t); }
        }
      }

      if ( ! cnt.length ) { return; }
      opt.SCwrapper = $(
        '<div class="sb1_calendar_shortcut_warpper">'+cnt.join(' ')+'</div>'
      ).appendTo( where || opt.widget ).on('click', helper._clickOnShortCut);        

      if ( typeof(selectedIndex) !== 'number' ) { return; }

      var node = opt.SCwrapper.find('.sb1_calendar_shortcut_item').eq( selectedIndex );
      if ( node.size() ) {
        var interval = helper._getRule( node ).timestamp || [];
        if ( typeof(opt.bfClickOnShortcutCallback)==='function' ) {
          var answer =  opt.bfClickOnShortcutCallback({
            'current': node, 'interval': interval, 'main': opt.main
          });
          if (answer===false ) { return; }
        }
        helper.setInterval( interval );
      }
    },

    setupController : function() {
      //var controller = opt.controller, count = controller.size();
      var controller = opt.controller, isField = controller.is('input[type="text"]');
      if ( ! opt.field  && (isField || (controller.is('input') && !controller.attr('type')) ) ) {
        opt.field = controller;
      }

      opt.interval = typeof(opt.interval)===true || opt.interval>=2 || 
        (opt.field && opt.field.size()=== 2) ? [null,null] : [null];

      opt.controller.each( function(i,dom) {
        opt.idList.push( helper._generateId($(dom)) );
      }).on( 'focus', helper._focus ).on( 'blur', helper._blur ).on('keyup', helper._keyup );

      if ( opt.field ) {
        var render = false;
        opt.field.each( function(i,dom) {
          if ( ! dom.value ) { return; }
          var date = helper._convertTextToDate( dom.value );
          if ( ! date ) { 
            dom.value = '';
          } else {
            helper._updateInterval( date.getTime(), i );
            render = true;
          }
        });
        if ( render ) { 
          helper._updateField();
        }
      }
    },

    setupStartCalender : function() {
      var view = opt.view || new Date(opt.nowYear,opt.nowMonth,1,0,0,0,0,0);
      var cnt  = [], cloned = new Date(view.getTime());
      var loop = opt.displayTable, i = 0;
      for ( i=0; i<loop; i++ ) {          
        view.setMonth( view.getMonth()+(i? 1: 0));
        if ( view.getTime() > opt.maxTime ) { 
          i = loop;
        } else {
          cnt.push( 
            '<div class="sb1_calendar_table_wrapper">'+
              helper._getCalendarTable( new Date(view.getTime()) ) +
            '</div>'
          );
        }
      }

      for ( i=cnt.length; i<loop; i++ ) {
        cloned.setMonth( cloned.getMonth()-1);
        if ( cloned.getTime() < opt.minTime ) { 
          i = loop;
        } else {
          cnt.push( 
            '<div class="sb1_calendar_table_wrapper">'+
              helper._getCalendarTable( new Date(cloned.getTime()) ) +
            '</div>'
          );
        }        
      }

      //cnt.push( '<a href="#" class="icon_top sb1_calendar_closer icon-close"></a>');
      cnt.push('<span class="icon_top icon-arrow_down"></span>');
      var style = 'sb1_calendar_widget included_icon_top view_count_'+loop + 
        ' display_' +(loop>1 ? 'multiple' : 'single');
      opt.widget = $('<div class="'+style+'"></div>')
        .appendTo( 'body' ).html( cnt.join('') );
      opt.idList.push( helper._generateId(opt.widget) );
    },

    setupWeekMonthLabel : function() {
      opt.week  = opt.label['week_'+opt.language];
      opt.month = opt.label['month_'+opt.language];
    },

    setupNowDate : function() {
      opt.nowYear  = opt.now.getFullYear();
      opt.nowMonth = opt.now.getMonth();
      opt.nowDate  = opt.now.getDate();
      opt.now = new Date( opt.nowYear,opt.nowMonth, opt.nowDate,0,0,0,0,0);
      opt.nowTime = opt.now.getTime();
      opt.nowDay = opt.now.getDay();
    },

    setupMaxMinDate : function() {
      if ( opt.max == 'today' ) { opt.max = opt.nowTime; }
      if ( typeof(opt.max)==='number' ) {
        opt.max = new Date(opt.max);
        opt.maxTime = opt.max.getTime();
        if ( opt.maxTime < opt.nowTime ) {
          opt.max = new Date( opt.nowTime+opt.aDay );
          opt.maxTime = opt.max.getTime();
        }
      }
      else {
        opt.max = new Date(opt.nowYear+100,11,31,0,0,0,0,0);
        opt.maxTime = opt.max.getTime();
      }

      if ( opt.min == 'today' ) { opt.min = opt.nowTime; }
      if ( typeof(opt.min)==='number' ) {
        opt.min = new Date(opt.min);
        opt.minTime = opt.min.getTime();
        if ( opt.minTime > opt.nowTime ) {
          opt.min = new Date( opt.nowTime );
          opt.minTime = opt.min.getTime();
        }
      }
      else {
        opt.min = new Date(opt.nowYear-100,11,31,0,0,0,0,0);
        opt.minTime = opt.min.getTime();
      }
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/
    isCalendarOpen : function() {
      return opt.widget.hasClass('sb1_show') && 
        opt.widget.prop('offsetWidth') > 0;
    },

    showCalendar : function( input ) {
      if ( ! input || ! input.size() ) { return; }
      setTimeout( function() { helper._revealWidget( input ); }, 15);

      $(window).off('click', helper._clickBody ).on('click', helper._clickBody );
      $(document).off('keyup', helper._keyupBody).on('keyup', helper._keyupBody );
      $(document).off('keydown', helper._keydownBody).on('keydown', helper._keydownBody );
    },

    hideCalendar : function( force ) {
      var widget = opt.widget;
      clearTimeout( parseFloat(widget.attr('data-timer') || '0') );
      widget.attr('data-timer', setTimeout( function() {
        var duration = parseFloat( widget.css('transition-duration') || '0')*1000;
        if ( duration ) {
          widget.addClass('force_visible');
          setTimeout( function() { widget.removeClass('force_visible'); }, duration );
        }
        widget.removeClass('sb1_show');
        $(window).off('click', helper._clickBody );
        $(document).off('keyup', helper._keyupBody );
        $(document).off('keydown', helper._keydownBody);
      }, force ? 1: 50 ) );
    },

    setInterval : function( interval ) {
      if ( typeof(interval) !== 'object' ) { return; }
      var list = interval instanceof Array ? interval : [interval];
      for ( var i=0; i<list.length; i++ ) {
        var stamp = list[i], index = i;
        helper._updateInterval( stamp, index, null, true );        
      }
      helper._updateField();
      helper._renewCalendarTable();
    },

    getInterval : function() { return opt.interval; },

    isTextfield : function( target ) {
      return ! target ? false : ( target.is('input[type="text"]') || 
        (target.is('input') && !target.attr('type'))
      );
    },

    /*************************************************************************
      === INTERNAL FUNCTION ===
    **************************************************************************/
    _clickBody : function( e ) {
      setTimeout( opt.timer.bodyClick || 0 );
      opt.timer.bodyClick = setTimeout( function() {
        if ( ! helper.isCalendarOpen() ) { return; }
        var target = $(e.target), isW = target.closest('#'+opt.idList.join(',#'));
        if ( isW.size() ) { return; }
        helper.hideCalendar();
      }, 150 );
    },

    _keydownBody : function( e ) {
      if ( ! helper.isCalendarOpen() || ! opt.focusTarget ) { return; }
      var code = e.keyCode;
      if ( (code>=38 && code<=40) || code===32 ) { e.preventDefault(); }
    },

    _keyupBody : function( e ) {
      setTimeout( opt.timer.bodyKeyup || 0 );
      opt.timer.bodyKeyup = setTimeout( function() {
        if ( ! helper.isCalendarOpen() ) { return; }

        var code = e.keyCode;
        if ( code === 13 || code === 32 || code === 27 || code>36 && code<41 ) {
          if ( code===13 ) {
            var focus = opt.widget.find(':focus');
            if ( focus.hasClass('sb1_calendar_table_navigator') ) { return; }
          }
          helper._navigateFocus( code );
        }
      }, 50 );
    },    

    _revealWidget : function( input ) {
      if ( ! input ) { input = opt.focusTarget; }
      if ( ! input ) { return; }

      var widget = opt.widget, view = helper._getWindowSize();
      var index  = opt.controller.index( input );

      clearTimeout( parseFloat(widget.attr('data-timer') || '0') );
      var wSize  = helper._getSize( widget ), iSize = helper._getSize( input );
      var offset = input.offset(), top = offset.top, left = offset.left; 
      var style  = 'top:'+(top+iSize[1])+'px;';

      if ( index > 0 ) {
        left = (left-wSize[0])+iSize[0];
        widget.addClass('other_controller');
      } else { widget.removeClass('other_controller'); }

      if ( left + wSize[0] > view[0] ) { left = view[0]-wSize[0]; }
      if ( left < 0 ) { left = 0; }
      style += 'left:'+left+'px;right:auto;';

      widget.attr('style',style).addClass('sb1_show');
    },

    _getSize : function( node ) {
      return [node.prop('offsetWidth'), node.prop('offsetHeight')];
    },

    _getRule : function( node ) {
      return node ? JSON.parse( 
        (node.attr('data-rule') || '{}').replace( /\'/g,'"')
      ) : {};
    },

    _resize : function( e ) {
      if ( helper.isCalendarOpen() ) { helper._revealWidget(); }
    },

    _keyup : function( e ) {
      var target = $(e.target), code = e.keyCode;
      clearTimeout( parseFloat(target.attr('data-timer') || '0') );
      if ( code===9 ) { return; }

      var isField = helper.isTextfield( target );
      var ignor   = ! isField || (target.is(':focus') && (code===37 || code===39));

      if ( code===13 || code===32 || code === 27 || code>36 && code<41 ){
        if ( isField ) { 
          setTimeout( function() { clearTimeout( opt.timer.bodyKeyup || 0 ); }, 15 );
        }
        return ignor ? null : helper._navigateFocus( code );
      }

      target.attr('data-timer', setTimeout(function(){
        var text = target.val(), date = helper._convertTextToDate( text );
        if ( ! date ) { return; }

        var index = opt.field.index( target );
        if     ( index < 0 ) { index = 0; }
        else if( index > 1 ) { index = 1; }

        helper._updateInterval( date, index );
        //helper._updateField();
        helper._renewCalendarTable();
      }, 100 ) );
    },

    _navigateFocus : function( code ) {
      if ( ! helper.isCalendarOpen() ) { return; }

      var widget = opt.widget;
      setTimeout( function() { 
        clearTimeout( parseFloat(widget.attr('data-timer') || '0') ); 
      }, 50 );

      if ( code===27 && opt.focusTarget ) { return opt.focusTarget.focus(); }

      var out = 'out_of_month', off = 'sb1_disabled';
      var all = widget.find('.sb1_calendar_table_navigator,.sb1_calendar_table_item'); 
      var current = all.not('.'+off+',.'+out), focus = current.filter(':focus');

      if ( (code===13 || code===32) && helper.isTextfield(opt.focusTarget ) ) {
        if ( focus.hasClass('sb1_calendar_table_navigator') ) { return; }
        return opt.focusTarget.focus();
      }

      if ( ! focus.size() ) { return current.eq(0).focus(); }

      if ( code===13 || code === 32 ) { return focus.click(); }
      
      var row = focus.attr('class').match( /at_row(\d+)/);
      if ( ! row ) { return; }

      var addition = code===37 || code===38 ?-1 : 1, item = null;
      var number = parseInt( row[1] ), same = all.filter('.at_row'+number );
      var index  = same.index( focus );
      if ( code===38 || code === 40 ) {
        if ( code===38 && number===0 ) { return; }

        var nRow = all.filter( '.at_row'+(number+addition) );
        var not  = nRow.not( '.'+off+',.'+out );
        if ( ! not.size() ) {
          not = all.filter( '.at_row'+(number+(addition*2))+':not(.'+off+',.'+out+')' );
        }

        if ( focus.hasClass('sb1_calendar_table_navigator') ) { 
          item = focus.hasClass('next') ? not.last() : not.first();
        } else if ( number+addition === 0 ) {
          item = index < (same.size() / 2) ? not.first() : not.last();
        }
        else { 
          item = nRow.eq( index );
          if ( item.hasClass(off) || item.hasClass(out) ) {
            item = nRow.not('.'+off+',.'+out).eq(0);
          }   
        }

        /*
        var item = row.eq( index );
        if ( item.hasClass(off) || item.hasClass(out) ) {
           = row.not('.'+off+',.'+out);
        }
        */
      }
      else {
        var next = index + addition;
        item = next < 0 || next >= same.size() ? null : same.eq( next );
        if ( item === null || item.hasClass(off) || item.hasClass(out) ) {
          index = current.index( focus ) + addition;
          item  = index < 0 ? null : current.eq( index );
        }
      }

      if ( item && item.size() ) { item.focus(); }
    },

    _forceFocus : function ( input, previous ) {
      var target = input || opt.focusTarget, widget = opt.widget;
      if ( ! target ) { return; }

      clearTimeout( parseFloat(widget.attr('data-timer') || '0') );
      var force = ! target.hasClass('on_focus') || previous === null ||
        (previous && previous.attr('id') !== target.attr('id'));

      if ( force ) {
        var date = target.val() ? helper._convertTextToDate( target.val() ) : null;
        if ( ! date ) {
          date = new Date( opt.nowTime );
          date.setDate( 1 );
        }
        helper._renewCalendarTable( date );
      }

      helper.showCalendar( target.addClass('on_focus') );
      setTimeout( function() { clearTimeout( opt.timer.bodyClick || 0 ); }, 50 );
      setTimeout( function() { clearTimeout( parseFloat(widget.attr('data-timer') || '0') ); }, 30 );
    },

    _focus : function( e ) {
      var previous = opt.focusTarget;

      opt.controller.removeClass('on_focus');

      opt.focusTarget = $( e.currentTarget );
      helper._forceFocus( null, previous );
    },

    _blur : function( e ) {
      var target = $( e.currentTarget ), widget = opt.widget;
      clearTimeout( parseFloat(widget.attr('data-timer') || '0') );      
      widget.attr('data-timer', setTimeout( function() {
        opt.focusTarget = null;
        target.removeClass('on_focus');
        helper.hideCalendar();
        helper._updateField();
      }, 100) );
    },

    _clickOnShortCut : function( e ) {
      var target  = $(e.target), parent = target.parent(), grand = parent.parent();
      var item    = 'sb1_calendar_shortcut_item';
      var current = target.hasClass( item ) ? target : ( 
        parent.hasClass( item ) ? parent : ( grand.hasClass( item ) ? grand : null ) 
      );
      
      if ( ! current || ! current.size() ) { return; }       
      e.preventDefault();
      var interval = helper._getRule( current ).timestamp || [];
      if ( typeof(opt.bfClickOnShortcutCallback)==='function' ) {
        var answer = opt.bfClickOnShortcutCallback({
          'event': e, 'current': current, 'interval': interval, 'main':main
        });
        if (answer===false ) { return; }
      }

      helper.setInterval( interval );
      if ( helper.isCalendarOpen() && opt.focusTarget ) {
        opt.focusTarget.focus();
      }
    },

    _click : function ( e ) {
      var target = $(e.target), parent = target.parent(), grand = parent.parent();
      if ( target.hasClass('sb1_calendar_closer') ) {
        e.preventDefault();
        if ( opt.focusTarget ) { opt.focusTarget.focus(); }
        return setTimeout( function() { 
          helper.hideCalendar( true );
        }, 100 );
      }

      var item = 'sb1_calendar_table_item', arrow = 'sb1_calendar_table_navigator';
      var current = target.hasClass( item ) || target.hasClass(arrow) ? target : ( 
        parent.hasClass( item ) || parent.hasClass( arrow ) ? parent : 
          ( grand.hasClass( item ) || grand.hasClass( arrow ) ? grand : null ) 
      );

      if ( target.closest('.sb1_calendar_widget').size() && opt.focusTarget ) { 
        helper._forceFocus( opt.focusTarget ); //opt.focusTarget.focus();
      }

      if ( ! current || ! current.size() ) { return; }

      e.preventDefault();
      if ( current.hasClass('disabled') ||  current.hasClass('sb1_disabled') ) { 
        return;
      }

      var rule = helper._getRule( current );
      var date = rule.timestamp ? new Date( parseInt(rule.timestamp) ) : null;
      if ( ! date ) { return; }

      if ( current.hasClass(arrow) ) { 
       helper._clickOnNavigator( current, date );
      } else {  
        helper._clickOnDate( current, date );
      }
    },

    _clickOnNavigator : function( node, date, forceNext ) {
      var table = node ? node.closest('table') : null;
      if ( ! table || ! table.size() ) { return; }

      var wrapper  = table.closest('.sb1_calendar_table_wrapper'), wait = 15;
      var isNext   = typeof(forceNext)==='boolean' ? forceNext : node.hasClass('next');
      var data     = helper._getDateAsList( date ); 
      var firstDay = new Date(data[0],data[1],1,0,0,0,0);

      var allTable = opt.widget.find('table:not(.newone)'), maxIndex = allTable.size()-1;
      var index    = allTable.index( table );

      if ( (isNext && index < maxIndex) || (! isNext && index > 0) ) {
        var nextTable = allTable.eq( index + (isNext ? 1: -1) );
        var stamp     = helper._getRule( nextTable ).timestamp;
        if ( stamp === firstDay.getTime() ) {
          var nextDate =  new Date(data[0],data[1]+(isNext ? 1 : -1),1,0,0,0,0);
          helper._clickOnNavigator( nextTable, nextDate, isNext );
        }
      }

      var newOne   = $( helper._getCalendarTable( firstDay ) ).addClass('newone');
      var duration = parseFloat( table.css('transition-duration') || '0')*1000;
      if ( duration ) {
        var size = helper._getSize( table );
        var left = size[0] + 10, style = 'position:absolute;top:0;';

        wrapper.css({'height':size[1]+'px'});
        if ( isNext ) {
          newOne.attr('style', style+'left:'+left+'px')
            .insertBefore( table.attr('style', style+'left:-'+left+'px') );
        } else {
          newOne.attr('style', style+'left:-'+left+'px')
            .insertBefore( table.attr('style', style+'left:'+left+'px') );
        }

        setTimeout( function() { newOne.css({'left': '0'}); }, wait );
        setTimeout( function() {
          table.remove();
          newOne.removeAttr('style').removeClass('newone');
          wrapper.removeAttr('style');
        }, duration+wait );
      } else { newOne.insertAfter(table).removeClass('newone'); table.remove(); }
    },

    _clickOnDate : function( node, date ) {
      if ( ! node || node.hasClass('out_of_month') || node.hasClass('sb1_disabled') ) { 
        return;
      }

      var isSelected = node.hasClass('sb1_selected'), index = null, toggler = false;
      var controller = opt.controller, interval = opt.interval, stamp = date.getTime();
      if ( interval.length === 1 ) { 
        index = 0;
      }
      else if ( controller.size() === 2 && interval.length === 2 ) {
        index = opt.focusTarget ? opt.controller.index( opt.focusTarget ) : -1;
        if ( index  === -1 ) { 
          index = controller.eq(0).is(':focus') ? 0 : 1;
        }
        else if ( index < 0 ) { 
          index = 0;
        }
        else if ( index > 1 ) { 
          index = 1;
        }

        //index = controller.eq(0).is(':focus') ? 0 : 1;
        if ( isSelected && interval[index] === stamp ) { date = null; }
      }
      else if ( controller.size() === 1 && interval.length === 2 ) {
        toggler = true;
        if ( interval[0]===null ) {
          index = 0;
        }
        else if ( interval[0]===stamp && isSelected ) {
          index = 0; date = null;
        }
        else if ( interval[1]===stamp && isSelected ) {
          index = 1; date = null;
        }
        else if ( interval[0] && interval[1]===null ) {
          index = 1;
        }
        else if ( interval[0]<stamp && stamp<interval[1] ) {
          index = (stamp-interval[0]) < (interval[1]-stamp) ? 0 : 1; 
        }
        else if ( interval[0]>stamp  ) {
          index = 0;
        }
        else if ( interval[1]<stamp  ) {
          index = 1;
        }
      }

      helper._updateInterval( date, index, toggler );
      helper._updateField();
      helper._renewCalendarTable();
    },

    _updateInterval : function( stamp, where, toggler, ignorChange ) {
      var interval = opt.interval, index = where; 
      if ( stamp !== null && typeof(stamp)==='object') { 
        stamp = stamp.getTime();
      }

      interval[index] = stamp; opt.active = {};
      if ( interval.length === 1 ) {
        if      ( interval[0] < opt.minTime ) { interval[0] = opt.minTime; }
        else if ( interval[0] > opt.maxTime ) { interval[0] = opt.maxTime; }

        opt.active[ interval[0] ] = true;
      }
      else if ( interval[0] === null && interval[1] ) {
        if ( interval[1] > opt.maxTime ) { interval[1] = opt.maxTime; }
        opt.active[ interval[1] ] = true;

        if ( toggler ) {
          interval[0] = interval[1];
          interval[1] = null;
        }
      }
      else if ( interval[0] && interval[1] === null ) {
        if ( interval[0] < opt.minTime ) { interval[0] = opt.minTime; }
        opt.active[ interval[0] ] = true;
      }
      
      if ( interval[0] && interval[1] ) {
        if ( interval[0] < opt.minTime ) { interval[0] = opt.minTime; }
        if ( interval[1] > opt.maxTime ) { interval[1] = opt.maxTime; }

        var change = interval[0] > interval[1], count = 0;
        if ( change && ! ignorChange ) {
          var holder  = interval[1];
          interval[1] = interval[0];
          interval[0] = holder;
        }
        var a = new Date(interval[0]);
        var b = new Date(interval[1]);
        while ( a.getTime()<=b.getTime() && count<1000 ) {
          opt.active[a.getTime()] = true;
          a.setDate( a.getDate()+1 );
          count++;
        }
      }

      if ( opt.SCwrapper ) {
        var item = opt.SCwrapper.find('> .sb1_calendar_shortcut_item');
        item.removeClass('sb1_active');
        if ( interval && (interval[0]||interval[1]) ) {
          var s = [interval[0]||interval[1], interval[1]||interval[0]];
          item.filter('.TIMESTAMP'+s.join('_')).addClass('sb1_active');
        }
      }
    },

    _updateField : function() {
      var interval = opt.interval || [], field = opt.field;
      if ( ! field || ! field.size() ) { return; }
      field.each( function(i,dom) {
        var text = ! interval[i] ? '' : 
          helper._convertDateToText( new Date(interval[i]) );
        dom.value = text;
        var node = $( dom ), error = 'sb1_form_validation_has_error';
        if ( node.hasClass(error) ) { node.trigger('validate'); }
      }); 
    },

    _renewCalendarTable : function( forceDate ) {
      opt.widget.find('table:not(.newone)').each( function(i,dom) {
        var table = $(dom), date = null; 
        if ( forceDate ) {
          date = new Date( forceDate.getTime() );
          date.setMonth( date.getMonth() + i);
        }
        else {
          var stamp = helper._getRule( table ).timestamp;
          date = stamp ? new Date( stamp ) : null;
        }
        if ( ! date ) { return; }

        var newOne = $( helper._getCalendarTable( date ) );
        table.html( newOne.html() );
      });
    },

    _verifyOnFocus : function() {
      opt.controller.each( function(i,dom) {
        var node = $(dom), mode = 'on_focus';
        if ( node.is(':focus') ) { 
          node.addClass(mode);
        } else { 
          node.removeClass( mode );
        }
      });
    },

    _generateId : function( node ) {
      var id = node ? node.attr('id') : null;
      if ( ! id ) {
        id = 'auto_'+(new Date()).getTime()+'_'+Math.floor((Math.random()*1000)+1);
        if ( node ) { node.attr('id',id); }
      }
      return id;
    },

    _getCalendarDateAriaText: function ( date, onlyMonthAndYear ) {
      if ( ! date ) { return ''; }
      var day   = opt.week[ date.getDay() ];
      var month = opt.month[date.getMonth()];
      return onlyMonthAndYear ? month +' '+date.getFullYear() :
        day + ', '+date.getDate()+'. '+month +' '+date.getFullYear();
    },

    _getCalendarTable : function( date ) {
      if ( ! date ) { return ''; }
      var aStyle = 'position:absolute;z-index:-1;width:1px;overflow:hidden;height:1px;left:0;top:0;font-size:1px';
      var d = helper._getDateAsList( date ), c = null, f = new Date(d[0],d[1],1,0,0,0,0);
      var tableTimestamp = '{\'timestamp\':'+f.getTime()+'}';
      var row = [], count = 0, day = opt.aDay;
      var current = opt.nowTime || 0, i = 0, j = 0;
      var active = opt.active || {}, min = opt.minTime || -1, max = opt.maxTime || -1;
      var focus  = opt.focusItem || {};

      if ( f.getDay() ) { 
        f.setDate( 1-(f.getDay()-1) );
      } else { 
        f.setDate( 1-6 );
      }

      var minRule  = '{\'timestamp\':'+(f.getTime()-day-1000)+'}';
      var minStyle = 'sb1_calendar_table_navigator previous' +
        (min > -1 ? (f.getTime() <= min ? ' sb1_disabled' : '') : '');

      for ( i=0; i<6; i++ ) {
        var column = [];
        for ( j=0; j<7; j++ ) {
          //c = new Date( f.getTime() + (count++ * day) );
          c = new Date( f.getTime() );
          c.setDate( c.getDate()+ (count++) );

          var v = c.getDate(), t = c.getTime(), n = helper._getDateAsList(c);
          var r = '{\'timestamp\':'+t+'}', s = 'sb1_calendar_table_item TIMESTAMP' + t +
            (max > -1 ? (max<t ? ' sb1_disabled': '') : '' ) + 
            (min > -1 ? (min>t ? ' sb1_disabled': '') : '' ) + 
            (n[1] === d[1] ? '' : ' out_of_month') +
            (current>=t && current<(t+day) ? ' is_today' : '') +
            (active && active[t] ? ' sb1_selected' : '')+ ' DATE'+helper._convertDateToText(c,'')+
            (focus && focus[t] ? ' sb1_focus' : '' ) + ' at_row'+(i+1)+
            ( j===0 || j===6 ? ' end_column' : '' );

          var a = helper._getCalendarDateAriaText( c ), isD = s.match( /out_of_month|sb1_disabled/);
          column.push(
            '<td role="presentation">'+
              '<a href="" data-rule="'+r+'" class="'+s+'" role="button"'+(isD ? ' tabindex="-1"':'')+'>'+
                '<span style="'+aStyle+'">'+a+'</span>'+
                '<span aria-hidden="true">'+v+'</span>'+
              '</a>'+
            '</td>'
          );
        }
        row.push('<tr role="presentation">'+column.join('')+'</tr>' );
      }

      c.setDate(1);
      if ( c.getMonth() === d[1] ) { c.setMonth(d[1]+1); }

      var maxRule  = '{\'timestamp\':'+(c.getTime()+day)+'}';
      var maxStyle = 'sb1_calendar_table_navigator next'+
        (max > -1 ? (max<c.getTime() ? ' sb1_disabled' : '') : '');
      
      var loop = opt.week.length, week = []; 
      for ( i=0; i<loop; i++ ) {
        j = i===0 ? (loop-1) : i-1; 
        week[j] = '<td role="presentation"><span class="week_name">'+
          opt.week[i].substring(0,2)+
        '</span></td>';
      }

      //var name  = (d[0] + ' '+ opt.month[d[1]]);
      var name  = (opt.month[d[1]] + ' ' +d[0]);
      if ( f.getMonth() === d[1] ) { f.setMonth(d[1]-1); }

      var aPrevious = (opt.label['get_calendar_'+opt.language] + ' '+
        helper._getCalendarDateAriaText( f, true )).toLowerCase();
      var aNext     = (opt.label['get_calendar_'+opt.language] + ' '+
        helper._getCalendarDateAriaText( c, true )).toLowerCase();

      return '<table class="sb1_calendar_table" aria-label="Kalender" role="application" data-rule="'+tableTimestamp+'">' +
          '<tr class="sb1_calendar_table_header calendar_month" role="presentation">' +
            '<td role="presentation">'+
              //'<a href="#" data-rule="'+minRule+'" class="'+minStyle+' at_row0" role="button">'+
              //  '<span style="'+aStyle+'">'+aPrevious+'</span>'+
              //'</a>'+
              '<a href="#" data-rule="'+minRule+'" class="icon-arrow_left at_row0 '+minStyle+'" role="button">'+
                '<span style="'+aStyle+'">'+aPrevious+'</span>'+
              '</a>'+
            '</td>'+
            '<td colspan="5" role="presentation"><span class="month_name">'+name+'</span></td>'+
            '<td role="presentation">'+
              //'<a href="#" data-rule="'+maxRule+'" class="'+maxStyle+' at_row0" role="button">'+
              //  '<span style="'+aStyle+'">'+aNext+'</span>'+
              //'</a>'+
              '<a href="#" data-rule="'+maxRule+'" class="icon-arrow_right at_row0 '+maxStyle+'" role="button">'+
                '<span style="'+aStyle+'">'+aNext+'</span>'+
              '</a>'+
            '</td>'+        
          '</tr>' +
          '<tr class="sb1_calendar_table_header calendar_weak" role="presentation">'+week.join('')+'</tr>' + 
            row.join('') +
        '</table>';
    },

    _getDateAsList : function( date ) {
      return [
        date.getFullYear(),date.getMonth(),date.getDate(),
        date.getHours(),date.getMinutes(),date.getSeconds()
      ];
    },

    _getShortcutDay : function( number ) {
      var text = helper._getShorcutText( 'day', number );
      var now = new Date(opt.nowTime), next = new Date(
        opt.nowYear,opt.nowMonth,opt.nowDate+(number||0),0,0,0,0,0
      );

      if ( number<0 ){ now.setDate(now.getDate()-1); }
      var interval = number<0 ? [next,now] : [now,next];
      var stamp    = [interval[0].getTime(),interval[1].getTime()];
      if      ( stamp[0] < opt.minTime ) { stamp[0] = opt.minTime; }
      else if ( stamp[1] > opt.maxTime ) { stamp[1] = opt.maxTime; }

      var type = 'sb1_calendar_shortcut_item sb1_daily TIMESTAMP'+stamp.join('_');
      var rule = '{\'timestamp\':['+stamp.join(',')+']}';
      return '<a href="#" class="'+type+'" data-rule="'+rule+'"><span>'+text+'</span></a>';
    },

    _getShortcutWeek : function( number ) {
      var text = helper._getShorcutText( 'week', number );
      var now  = new Date(opt.nowTime -(((opt.nowDay||7)-1)*opt.aDay));
      var next = new Date( now.getTime() );
      next.setDate( next.getDate()+( (! number ? 1 : (number>0 ? number+1: number))*7) );

      if ( number<0 ){ 
        now.setDate(now.getDate()-1); 
      } else {
        next.setDate(next.getDate()-1);         
      }
      var interval = number<0 ? [next,now] : [now,next];
      var stamp    = [interval[0].getTime(),interval[1].getTime()];
      if      ( stamp[0] < opt.minTime ) { stamp[0] = opt.minTime; }
      else if ( stamp[1] > opt.maxTime ) { stamp[1] = opt.maxTime; }

      var type = 'sb1_calendar_shortcut_item sb1_weekly TIMESTAMP'+stamp.join('_');    
      var rule = '{\'timestamp\':['+stamp.join(',')+']}';
      return '<a href="#" class="'+type+'" data-rule="'+rule+'"><span>'+text+'</span></a>';
    },

    _getShortcutMonth : function( number, onlyThatUnit ) {
      var text = helper._getShorcutText( 'month', number, onlyThatUnit );
      var now  = new Date(opt.nowTime - (((opt.nowDate||12)-1)*opt.aDay));
      var next = new Date( now.getTime() );
      next.setMonth( next.getMonth()+(! number ? 1 : (number>0 ? number+1: number)));

      if ( number<0 ){ 
        now.setDate(now.getDate()-1); 
      } else {
        next.setDate(next.getDate()-1);         
      }

      if ( onlyThatUnit ) {
        now = new Date( next.getTime() );
        now.setDate( 1 );
        if ( number<0 ) {
          now.setMonth( now.getMonth()+1 );
          now.setDate( 0 ); 
        }
      }

      var interval = number<0 ? [next,now] : [now,next];
      var stamp    = [interval[0].getTime(),interval[1].getTime()];
      if      ( stamp[0] < opt.minTime ) { stamp[0] = opt.minTime; }
      else if ( stamp[1] > opt.maxTime ) { stamp[1] = opt.maxTime; }

      var type = 'sb1_calendar_shortcut_item sb1_monthly TIMESTAMP'+stamp.join('_');
      var rule = '{\'timestamp\':['+stamp.join(',')+']}';
      return '<a href="#" class="'+type+'" data-rule="'+rule+'"><span>'+text+'</span></a>';
    },

    _getShorcutText : function( type, number, onlyThatUnit ) { 
      var abs  = number ? (number<0 ? (number*-1) : number) : '';
      var lead = number < 0 ? 'shortcut_last' : 'shortcut_about'; 
      var unit = opt.label[lead+'_'+type+'_'+opt.language]+
        (opt.language==='en' ? (abs>1 ? 's' : '') : 
          ( number>1 ? (opt.language==='nn' ?'ar' :'er') : '') 
        );
      var from = onlyThatUnit ? '' : '';
      var key  = 'shortcut_'+type+(number>0 ? '+':'')+(number || '')+'_'+opt.language;
      return helper._capitaliseFirstLetter(
        opt.label[key] || (from+abs+' '+opt.label[lead+'_'+opt.language]+' '+unit)
      );
    },

    _convertDateToText : function ( date, separator ) {
      var l = [date.getDate(),date.getMonth()+1,date.getFullYear()];
      for ( var i=0; i<l.length; i++ ) {
        if ( l[i] < 10 ) { l[i] = '0'+l[i]; }
      }
      return l.join( typeof(separator)==='undefined' ? '.' : separator );
    },

    _convertTextToDate : function ( text, separator ) {
      var r = (text ||'').replace( /^\s+/,'').replace( /\s+$/,'');
      if ( ! r.match( opt.pattern ) ) { return null; }

      var s = r.split( typeof(separator)==='undefined' ? '.' : separator );
      for ( var i=0; i<s.length; i++ ) { 
        s[i] = parseInt( s[i].replace( /^0/, '' ));
      }
      return new Date(s[2],s[1]-1,s[0],0,0,0,0);
    },    

    _getWindowSize : function() {
      var size = [0, 0];
      if ( ! window.innerWidth ) { // IE 
        //if ( !(document.documentElement.clientWidth === 0) ){
        if ( ! document.documentElement.clientWidth ){
          size[0] = document.documentElement.clientWidth;
          size[1] = document.documentElement.clientHeight;
        } 
        else {
          size[0] = document.body.clientWidth;
          size[1] = document.body.clientHeight;
        }
      } 
      else {
        size[0] = window.innerWidth;
        size[1] = window.innerHeight;
      }

      if ( size[0] ) { size[0] -= 20; }
      return size;
    },

    _capitaliseFirstLetter : function( text ){
      return text ? (text.charAt(0).toUpperCase()+text.slice(1).toLowerCase()): '';
    },

    _none : function() {}
  };

  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) { method[k] = helper[k]; }
  }
  
  this.SB1calendar = method;
  setTimeout( helper.init, 100 );
  return this;
}; } )( jQuery );


function debug( text, value ) {
  var debug = $('div#debugWidget'), v = '', d = new Date();
  if ( ! debug.size() ) {
    var s = 'z-index:1000; position:fixed; bottom:5px; right:5px; width:300px; height:300px;' +
      'background-color:#FFFFFF; overflow:scroll; border:1px solid red; display:block;font-size:12px';
    debug = $( '<div id="debugWidget" style="'+s+'"></div>').appendTo( $('body') );
  }
  
  var t = d.getMinutes() + ':' + d.getSeconds();
  if ( value != null ) {
    if ( typeof(value) != 'object' )
      v = value;
      else if( value instanceof Array )
      v = value.join('<br/>');
    else {
      var data = [];
      for ( var k in value ) data.push( k + ' : ' + value[k]);
      v = data.join( '<br/>' );
    }
  }
  debug.html( t + '<br/>' + text + '<br/>' + v + '<div>&nbsp;</div>' + debug.html() );
};
//*/
