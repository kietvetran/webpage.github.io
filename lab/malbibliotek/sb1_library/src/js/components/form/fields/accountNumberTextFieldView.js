var TextFieldView = require("./textFieldView");
var ValidationMessages = require("../mixins/validationMessages");
var texts = require('../textResources');
var AccountNumber = require('../../../domain/accountNumber');
var _ = require("underscore");

var accountFieldView = TextFieldView.extend({
    /**
     * Method for formatting account number with dots as separators
     */
    formatAccountNumber: function (accNo) {
        return accNo.replace(/(\d{4})[\. ]?(\d{2})[\. ]?(\d{5})/g, '$1.$2.$3');
    },
    getDisplayValue: function () {
        return this.formatAccountNumber(this.getInputValue());
    },
    /**
     * Method getting value from field without dots.
     */
    value: function () {
        var text = this.getInputValue();
        // remove separators, if any, from value to be submitted
        return text.length > 0 ? text.replace(/[\. ]/g, '') : undefined;
    },
    getInputValue: function () {
        return this.$el.find("#" + this.options.id).val();
    },
    /**
     * Method for checking required and calling content validation
     */
    validateField: function ()  {
        var valid = (_.isEmpty(this.value()) && this.options.required) ? false : this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.ACCOUNT_FIELD_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method handling blurring of field. Calling validation methods.
     * Returning validaiton object.
     */
    _blurHandler: function () {
        this.removeWhitespaceAndPoint();
        var valid = this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.ACCOUNT_FIELD_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method checking if field value is valid
     */
    isValid: function () {
        var valid = true;
        if(!_.isEmpty(this.value())){
            valid = this.options.pattern.test(this.value().toLowerCase()) && new AccountNumber(this.value()).isValid();
        }
        return valid;
    },
    removeWhitespaceAndPoint: function ()
    {
        this.$("#" + this.options.id).val(function(i, v) {
            return v.replace(/[\s\.]/g, '');
        });
    }
});

accountFieldView.mixin(ValidationMessages);

module.exports = accountFieldView;