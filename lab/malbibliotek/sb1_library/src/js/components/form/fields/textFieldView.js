var BaseView = require("base").View;
var ValidationMessages = require("../mixins/validationMessages");
var ariaHelper = require('../ariaHelper');
var _ = require('underscore');
var texts = require('../textResources');

var textFieldView = BaseView.extend({
    events: {
        "blur input": "_blurHandler"
    },
    initialize: function (options)
    {
        this.options = options;
    },
    /**
     * Method for validation of field on blur.
     */
    _blurHandler: function ()
    {
        var valid = this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.TEXT_FIELD_CONTENTS_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method for checking required and calling content validation method
     * Returns validation object.
     */
    validateField: function ()
    {
        var valid = (_.isEmpty(this.value()) && this.options.required) ? false : this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.TEXT_FIELD_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method checking if field value is valid
     */
    isValid: function () {
        if (!_.isEmpty(this.value()))
        {
            return this.options.pattern.test(this.value().toLowerCase());
        }
        return true;
    },
    value: function ()
    {
        return this.$("#" + this.options.id).val();
    },

    removeWhitespace: function ()
    {
        this.$("#" + this.options.id).val(function(i, v) {
            return v.replace(/\s/g, '');
        });
    },

    /**
     * Method toggling error marking of text field
     */
    toggleErrorMarking: function (valid) {
        this.$el.toggleClass("error", !valid);
        // finding :input because the "input" can be a textarea
        ariaHelper.setAriaInvalid(this.$(':input'), valid);
    },

    getDisplayValue: function ()
    {
        return this.value();
    }
});

textFieldView.mixin(ValidationMessages);

module.exports = textFieldView;