var BaseView = require("base").View;
var ValidationMessages = require("../mixins/validationMessages");
var ariaHelper = require('../ariaHelper');
var _ = require('underscore');
var texts = require('../textResources');

var radioFieldView = BaseView.extend({
    events : {
        "change input": "_blurHandler"
    },
    initialize : function(options) {
        this.options = options;
    },
    value: function () {
        var radios = this.$el.find('input:radio[name=' + this.options.groupName + ']');
        var selectedRadio = _.filter(radios, function (el) {
            return $(el).is(':checked');
        });
        return $(selectedRadio).siblings('label').html();
    },
    getDisplayValue: function() {
        return this.value();
    },
    _blurHandler : function() {
        var valid = this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.RADIO_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method for checking required and calling content validation method
     */
    validateField: function ()  {
        var valid = (_.isEmpty(this.value()) && this.options.required) ? false : this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.RADIO_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method checking if field value is valid
     */
    isValid: function () {
        if (_.isEmpty(this.value())) {
            return !this.options.required;
        }
        return true;
    },
    toggleErrorMarking: function (valid) {
        this.$el.toggleClass("error", !valid);
        ariaHelper.setAriaInvalid(this.$('input'), valid);
    },
    focusCursor: function() {
        this.$el.find("a").first().focus();
    },
    setTabIndex: function() {
        // circumvent customRadioButton.js custom tab indexing
        this.$el.find("a").first().removeAttr("tabindex");
    }
});

radioFieldView.mixin(ValidationMessages);

module.exports =  radioFieldView;