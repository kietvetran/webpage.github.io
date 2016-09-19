var BaseView = require("base").View;
require('jquery-ui/datepicker');

var ValidationMessages = require("../mixins/validationMessages");
var ariaHelper = require('../ariaHelper');
var _ = require('underscore');
var texts = require('../textResources');

var dateFieldView = BaseView.extend({
    events : {
        "change input": "_changeHandler",
        "click input":  function(e) {
            this.handleClick(e);
            this._changeHandler(e);
        }
    },

    validDateFormats : ["DD.MM.YY", "DD.MM.YYYY", "DDMMYY", "DDMMYYYY"],

    handleClick: function(event) {
        $(event.currentTarget).datepicker();
    },
    initialize : function(options) {
        this.options = options;
        var dateId = this.options.id;
        this.$el.find('#' + dateId).datepicker({ dateFormat: 'dd.mm.yy' });
    },
    /**
     * Private method validating date
     */
    _validateDate: function(text) {
        // Do regex check to avoid creating moment with undefined
        var valid = this.options.pattern.test(text.toLowerCase());
        return valid;
    },
    /**
     * Method handling changed values
     */
    _changeHandler: function(event) {

        var valid = this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.DATE_TO_FROM_ERROR);
        }
        this.toggleErrorMarking(valid);

        if (valid) {
            if (!_.isEmpty(this._value())) {
                $(event.currentTarget).val(this._value());
            }
        }
    },
    /**
     * Method for checking required and calling content validation
     */
    validateField: function ()  {
        var valid = (_.isEmpty(this._value()) && this.options.required) ? false : this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.DATE_TO_FROM_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method checking if field value is valid
     */
    isValid: function () {
        if (!_.isEmpty(this._value())) {
            return this._validateDate(this._value());
        }
        return true;
    },
    _value: function () {
        return this.$el.find("#" + this.options.id).val();
    },
    getValueForSubmit: function() {
        var text = this._value();
        return this._validateDate(text) ? text : undefined;
    },
    getDisplayValue: function() {
        return this._value();
    },
    /**
     * Method toggling error marking.
     */
    toggleErrorMarking: function (valid) {
        this.$el.toggleClass("error", !valid);
        ariaHelper.setAriaInvalid(this.$('input'), valid);
    }
});

dateFieldView.mixin(ValidationMessages);
module.exports = dateFieldView;