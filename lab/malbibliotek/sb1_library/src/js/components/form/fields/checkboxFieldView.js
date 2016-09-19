var BaseView = require("base").View;
var ValidationMessages = require("../mixins/validationMessages");
var ariaHelper = require('../ariaHelper');
var _ = require('underscore');
var texts = require('../textResources');

var checkboxFieldView = BaseView.extend({

    events : {
        "change input": "valueChanged"
    },
    initialize : function(options) {
        this.options = options;

    },
    value: function() {
        var selected =
            _.filter(this.$el.find('input:checkbox[name=' + this.options.groupName + ']'), function (el) {
                return $(el).is(':checked');
            });
        var list = $(selected).siblings('label');
        return _.reduce(list, function(memo, data) { return memo + $(data).html() + ", ";}, "").slice(0, -2);
    },
    getDisplayValue: function() {
        return this.value();
    },
    /**
     * Method removing error marking on changed value
     */
    valueChanged: function() {
        var valid = this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.CHECKBOX_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method checking required  setting.
     */
    validateField: function ()  {
        var valid = (_.isEmpty(this.value()) && this.options.required) ? false : this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.CHECKBOX_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method checking if field value is valid
     */
    isValid: function () {
        if (!_.isEmpty(this.value())) {
            return this.options.required;
        }
        return true;
    },
    /**
     * Method toggling error marking of text field
     */
    toggleErrorMarking: function (valid) {
        this.$el.toggleClass("error", !valid);
        ariaHelper.setAriaInvalid(this.$('input'), valid);
    },
    focusCursor: function() {
        this.$el.find("a").first().focus();
    }
});

checkboxFieldView.mixin(ValidationMessages);

module.exports = checkboxFieldView;