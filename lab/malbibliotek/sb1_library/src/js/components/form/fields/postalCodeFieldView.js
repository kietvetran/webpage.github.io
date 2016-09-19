var TextFieldView = require("./textFieldView");
var ValidationMessages = require("../mixins/validationMessages");
var texts = require('../textResources');
var _ = require("underscore");

var postalCodeFieldView = TextFieldView.extend({
    initialize: function (options) {
        this.options = options;
    },
    /**
     * Method for checking required and calling content validation method
     */
    validateField: function ()  {
        var valid = (_.isEmpty(this.value()) && this.options.required) ? false : this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.POSTAL_CODE_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    _blurHandler: function () {
        this.removeWhitespace();

        var valid = this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.POSTAL_CODE_ERROR);
        }
        this.toggleErrorMarking(valid);
    }
});

postalCodeFieldView.mixin(ValidationMessages);

module.exports = postalCodeFieldView;