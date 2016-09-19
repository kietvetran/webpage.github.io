
var ValidationLabelMixin = {
    addValidationErrorLabel: function(text) {
        this.$('.sb1_form_validation_error span').html(text);
    }
};

module.exports = ValidationLabelMixin;