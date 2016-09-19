var scrollToFit = require('./scroll-to-fit');

$(function() {
    var aForm;
    // Encapsulate the menu functionality
    var ContactMenu = {
        // Cache the menu items to avoid DOM operations
        menuItems: $('.contact-section .customer-action-wrap li a'),
        menu: $('.menu-template').html(),
        previousMedia: '',
        sectionElement: null,
        sectionIcon: null,

        filterItems: function() {

            if( ContactMenu.sectionElement) ContactMenu.sectionElement.remove();
            if( ContactMenu.sectionIcon) ContactMenu.sectionIcon.addClass('hide'); 

            if($(window).width() > 500){

                if( ContactMenu.previousMedia != 'large' ) {
                    // Remove menu
                    $('.contact-section .customer-action-wrap ul').remove();
                    // Attached template
                    $('.contact-section .customer-action-wrap').append( ContactMenu.menu);

                    ContactMenu.previousMedia = 'large';
                    $('.contact-section .customer-action-wrap li.hidden-desktop').remove();
                    ContactMenu.menuItems = $('.contact-section .customer-action-wrap li');

                    ContactMenu.atachEvents();
                };

            }else{

                if( ContactMenu.previousMedia != 'small' ) {
                    // Remove menu
                    $('.contact-section .customer-action-wrap ul').remove();
                    // Attached template
                    $('.contact-section .customer-action-wrap').append( ContactMenu.menu);

                    ContactMenu.previousMedia = 'small';                    
                    $('.contact-section .customer-action-wrap li.hidden-phone').remove();
                    ContactMenu.menuItems = $('.contact-section .customer-action-wrap li');
                    ContactMenu.atachEvents();
                };
            }
        },

        // Used to calculate the layout of the existing ul 
        // The layout changes depending on screen size

        getLayoutInfo: function() {

            var itemsInRow = 0;
            // Go through each menu item
            ContactMenu.menuItems.each( function() {
                // Cache
                var $this = $(this);
                // 
                if( $this.prev().length > 0) {
                    // Return don't count the item if it's not in the same position i.e. it means its in a different row
                    if( $this.position().top != $this.prev().position().top) return false;
                    itemsInRow++;
                }
                else {
                    itemsInRow++;
                }

            });

            var lastRowItems = ContactMenu.menuItems.length % itemsInRow;
            if(lastRowItems === 0) {
                lastRowItems = itemsInRow;
            }

            return {
                itemsInRow: itemsInRow,
                lastRowItems: lastRowItems,
                numberOfRows: Math.ceil( ContactMenu.menuItems.length / itemsInRow )
            };
        },
        // Used to listen to user clicks on each menu
        // It will work out where to put the menu content
        // depending on the screen size i.e. responsive.
        atachEvents: function() {
            // Whenever user clicks on a menu item do the below
            ContactMenu.menuItems.on( 'click', function( e) {
                var eSection = $('.customer-action-wrap .appended-section');
                e.preventDefault();
                // Cache
                var $this = $(this);
                // Get the clicked item index i.e. which item was clicked
                var itemIndex = $this.index() + 1;
                // Get layout info about the current state of the menu items
                var layout = ContactMenu.getLayoutInfo();
                // Which row is the current clicked menu item
                var currentRow = Math.ceil( itemIndex / layout.itemsInRow);
                // Figure out after which menu item to append
                var appendIndex = (layout.itemsInRow * currentRow) - 1;
                // Get the actual element
                var appendElement = ContactMenu.menuItems[ appendIndex] || ContactMenu.menuItems[ ContactMenu.menuItems.length - 1 ] ;
                // Get the section html from the template based the data attribute on the menu item            
                var sectionHtml = $('#' + $this.data('menu-section')).html();
                // Remove any existing displayed section
                eSection.remove();
                // Add the section in the correct location
                $(appendElement).after( sectionHtml);
                // CAche section element
                ContactMenu.sectionElement = $('.customer-action-wrap .appended-section');
                // Cashe section icon
                ContactMenu.sectionIcon = ContactMenu.menuItems.find('div.icon');

                ContactMenu.sectionElement.find('input').first().focus();
                // Call API hook before appending the html
                ContactMenu.onMenuClick( $this, ContactMenu.sectionElement);

            });

            $('.contact-section .customer-action-wrap li .icon span').on('click', function (e) { 
                e.stopPropagation();
                $('.customer-action-wrap .appended-section').remove();
                ContactMenu.menuItems.find('div.icon').addClass('hide');
            });

            $(window).resize(ContactMenu.filterItems);
        },
        // API hook to add more behaviour for when a user clicks on a menu
        onMenuClick: function( $li, eSection ) {
            ContactMenu.menuItems.find('div.icon').addClass('hide');
            ContactMenu.menuItems.find('a').removeClass('active');
            $li.find('div.icon').removeClass('hide');
            $li.children('a').addClass('active');
            if (eSection !== undefined) {
                scrollToFit( eSection);
            }

            if(eSection.find('form').length > 0) {
                ContactMenu.activateDropdownMenu( eSection );
                ContactMenu.activateFormValidation( eSection );
                ContactMenu.onAddTimeClick(eSection);
            }
        },

        activateDropdownMenu: function ( eSection ) {
            eSection.find('.sb1_dropdown_menu').each( function (i,d) { 
                $(d).SB1dropdownMenu({}); 
            });  
        },

        activateFormValidation: function ( eSection ) {
            aForm =  eSection.find('form').SB1formValidation({
                'language' : 'nb',
                'summary_error' : '.error_summary_holder',
                'validationErrorMessage' : {
                    postnumber: {
                        'invalid_post_number' : {
                            'nb': 'Ugyldig postnummer.',
                            'en': 'Invalid post number.'
                        },
                        'field_required' : {
                            'nb': 'Postnummer er påkrevd',
                            'en': 'Postnumber is required.'
                        }
                    },
                    name: {
                        'field_required' : {
                            'nb': 'Navn er påkrevd',
                            'en': 'Name is required.'
                        }
                    },
                    telephone: {
                        'field_required' : {
                            'nb': 'Telefonnr er påkrevd',
                            'en': 'Telephone number is required.'
                        }
                    }
                }
            });
            eSection.find('.submit-btn').on('click' , function(e){
                e.preventDefault();
                aForm.validate();

                if ( ! aForm.isSuccess() ) return aForm.showSummary();
                
                var url = $(this).closest('.appended-section').find('form').data('path') + '.social.json';
                var data = aForm.getFormData();
    
               /*$.post(url, {
                    'id': 'nobot',
                    ':operation': 'social:createComment',
                    'message': data
                });*/
                
                aForm.resetForm();
            });

        },
        
        onAddTimeClick: function (eSection) {
            var btn = eSection.find('.add-appointment');
            var elm = eSection.find('.appointments');
            var html =  eSection.find('.appointments').html();

            btn.on('click', function (e) {
                e.preventDefault();
                elm.append(html);
                ContactMenu.activateDropdownMenu( elm.find('.appointment-selection').last() );
                aForm.bindInput();
            });
        },

        // Init the menu
        init: function() {
            ContactMenu.filterItems();
            ContactMenu.atachEvents();
        }
    };
    // Start it up
    ContactMenu.init();

});



