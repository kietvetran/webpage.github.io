var DropDownComponentView = require("../components/dropdown/dropdownComponent");
var TextFieldView = require("./textFieldView");
var ValidationMessages = require("../mixins/validationMessages");
var ariaHelper = require('../ariaHelper');
var texts = require('../textResources');
var _ = require("underscore");

var dropdownFieldView = TextFieldView.extend({


    events : {
        "blur .sb1_dropdown_btn": "valueChanged",
        "change input": "valueChanged"
    },

    initialize : function(options) {
        this.options = options;
        new DropDownComponentView(options);
    },

    /**
     * Method for checking required and calling content validation method
     */
    validateField: function()  {
        var valid = (_.isEmpty(this.value()) && this.options.required) ? false : this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.DROPDOWN_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method checking if field value is valid
     */
    isValid: function() {
        if (!_.isEmpty(this.value())) {
            return this.options.required;
        }
        return true;
    },

    value: function() {
        return this.$("#" + this.options.id).val();
    },
    /**
     * Method fremoving error marking on value changed
     */
    valueChanged: function() {
        var valid = this.isValid();
        if (!valid) {
            this.addValidationErrorLabel(texts.DROPDOWN_ERROR);
        }
        this.toggleErrorMarking(valid);
    },
    /**
     * Method toggling error marking of field
     */
    toggleErrorMarking: function (valid) {
        this.$el.toggleClass("error", !valid);
        ariaHelper.setAriaInvalid(this.$('input'), valid);
    },
    focusCursor: function() {
        this.$el.find("a").first().focus();
    }
});

dropdownFieldView.mixin(ValidationMessages);

module.exports = dropdownFieldView;