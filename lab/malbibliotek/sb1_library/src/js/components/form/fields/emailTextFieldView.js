var TextFieldView = require("./textFieldView");
var ValidationMessages = require("../mixins/validationMessages");
var texts = require('../textResources');
var _ = require("underscore");

var emailFieldView = TextFieldView.extend({

    /**
     * Method for checking required and calling content validation
     */
    validateField: function ()  {
        var valid = (_.isEmpty(this.value()) && this.options.required) ? false : this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.EMAIL_FIELD_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method handling blurring of field. Calling validation methods.
     * Returning validation object.
     */
    _blurHandler: function () {
        var valid = this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.EMAIL_FIELD_ERROR);
        }
        this.toggleErrorMarking(valid);
    }
});

emailFieldView.mixin(ValidationMessages);

module.exports = emailFieldView;