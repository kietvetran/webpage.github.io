var _ = require("underscore");

var listNavigation = {
    currentSelected: -1,

    initialize: function () {
        this.navigationFieldKeydownHandler = _.throttle(this.navigationFieldKeydownHandler, 5);
    },

    setNavigationField: function($navigationField) {
        this.$navigationField = $navigationField;
    },

    /*
     *  Keydown-handler for the items in the list.
     */
    navigationFieldKeydownHandler: function(event) {
        var keyCode = event.keyCode;
        if(keyCode === 38){ // up
            event.preventDefault();
            this.navigateUp();
        } else if(keyCode === 40) { //down
            event.preventDefault();
            this.navigateDown();
        } else if(keyCode === 13) { //enter
            event.preventDefault();
        }
    },

    navigationFieldKeyupHandler: function(event) {
        if(event.keyCode === 13 ) { // enter
            event.preventDefault();

            var $highlightedItem = this.$list.find('.highlight');

            if ($highlightedItem && $highlightedItem.length === 1) {
                $highlightedItem.click();
            } else {

                if(this.$dropDownFooter !== undefined && this.$dropDownFooter.hasClass("highlight")) {
                    this.$dropDownFooter.find('a').click();
                }
            }
        }
    },

    navigateUp: function(){
        this.navigate(-1);
    },

    navigateDown: function(){
        this.navigate(1);
    },

    defaultSelectedIndex: -1,

    navigate: function(direction) {
        // Set focus back to source field in case this has been temporarily set to dropdown footer
        this.$sourceField.focus();

        var index = _.isNumber(this.currentSelected) ? this.currentSelected + direction : this.defaultSelectedIndex;

        if(this.$dropDownFooter && this.$dropDownFooter.length !== 0 && (index <= -1 || index === this.$listItems.length)) {
            index = this.$listItems.length;
        } else if(index <= -1) {
            // if index is lower than 0 start at bottom of the list
            index = this.$listItems.length -1;
        } else if(index >= this.$listItems.length) {
            // if index is larger then number of listItems start at the start
            index = 0;
        }

        this.moveHighlightTo(index);
    },

    moveHighlightTo: function(index){
        this.$listItems.removeClass("highlight");

        if(this.$dropDownFooter && this.$dropDownFooter.length !== 0) {
            this.$dropDownFooter.removeClass("highlight");

            if(index === this.$listItems.length) {
                this.$dropDownFooter.addClass("highlight");
                this.$sourceField.attr("aria-activedescendant", this.$dropDownFooter.attr("id"));
            }
        }

        this.currentSelected = index;

        if( this.$listItems &&
            this.$listItems.length > index &&
            index > -1
        ){
            var $toBeSelectedListItem = this.$listItems.eq(index);
            $toBeSelectedListItem.addClass("highlight");
            var activeId = $toBeSelectedListItem.attr("id");
            if (activeId && this.$navigationField.is("[role]")) {
                this.$navigationField.attr("aria-activedescendant", activeId);
            }

            this.scrollToKeepSelectedItemVisible($toBeSelectedListItem);
        } else {
            this.$list.scrollTop(0);
        }
    },

    /**
     * Handles scrolling in the dropdown-list
     */
    scrollToKeepSelectedItemVisible: function($highlightedItem) {
        var listHeight = this.$list.height();
        var itemHeight = $highlightedItem.outerHeight();
        var scrollTop = this.$list.scrollTop();

        // In some cases $highlightedItem.offsetParent() doesn't return any value
        // this causes the page to fail. For this reason we only execute the code
        // below if offsetParent can be found.
        if($highlightedItem.offsetParent()[0])
        {
            var highlightTop = $highlightedItem.position().top;
            var highlightBottom = highlightTop + itemHeight;

            if(highlightBottom >= listHeight) {
                //Item is under the viewport
                this.$list.scrollTop(highlightTop + scrollTop - (listHeight - itemHeight));
            } else if( highlightTop < 0 ) {
                //Item is over the viewport
                this.$list.scrollTop(scrollTop + highlightTop);
            } else {
                // Item is in viewport, noop
            }
        }
    }

};

module.exports = listNavigation;