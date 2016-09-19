var BaseView = require("base");
var listNavigationMixin = require("./listNavigationMixin");


var DropDownComponent = BaseView.View.extend({

    events: {
        "click .sb1_dropdown_option": "select",
        "click .sb1_dropdown_btn": "toggleDropdown",
        "keyup": "navigationFieldKeyupHandler",
        "keydown": "navigationFieldKeydownHandler"
    },

    toggleDropdown: function(e) {
        e.preventDefault();
        this.$dropdown.toggle();
        this.$sourceField.focus();
    },

    $sourceField: null,
    $dropdown: null,

    /**
     * Below are concrete methods which implementing components should only override when needed.
     */
    initialize: function(options) {

        $("body").click(function(e) {
            if (!$(e.target).is(this.$sourceField)) {
                this.$('.sb1_dropdown_list').hide();
            }
        }.bind(this));

        this.$sourceField = this.$('.sb1_dropdown_btn');
        this.$dropdown = this.$('.sb1_dropdown_list');
        this.setNavigationField(this.$sourceField);

        this.$list = this.$('ul');
        this.$listItems = this.$list.find("li");
    },

    /**
     * Selects a li-element in the list of dropdown-elements, removes highlight/selected-classes in all listelements,
     * sets highlight on the highlight,selected on the selected item and updates the source select element
     */
    select: function(e) {
        this.$dropdown.find('.selected').removeClass("selected highlight");

        var $listItem = $(e.target);
        $listItem.addClass("selected highlight");

        this.selectItem($listItem);
    },

    // shows dropdown fist time up or down is pressed,
    // then use normal list navigation
    navigationFieldKeydownHandler: function(event) {
        var keyCode = event.keyCode;
        if (!this.$dropdown.is(":visible") && (keyCode === 38 || keyCode === 40)) {
            event.preventDefault();
            this.$dropdown.show();
        } else if (keyCode === 9) { // tab
            this.$dropdown.hide();
        } else if(keyCode === 27) { // esc
            event.preventDefault();
            this.$dropdown.hide();
        } else {
            // call mixin super
            listNavigationMixin.navigationFieldKeydownHandler.call(this, event);
        }
    },

    /**
     * Selects an item based on the data-dropdown-value. If an a-tag with the data-dropdown-value isn't found,
     * no action is taken.
     *
     * @param key
     */
    selectItem : function($listItem) {
        this.$sourceField.html($listItem.html());
        this.$('input').val($listItem.data('value')).trigger('change');
    }

});

DropDownComponent.mixin(listNavigationMixin);

module.exports = DropDownComponent;