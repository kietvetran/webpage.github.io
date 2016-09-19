module.exports = {
    setAriaInvalid: function($input, isValid) {
        // true = The value has failed validation.
        // false = (default) No errors detected
        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-invalid_attribute
        $input.attr('aria-invalid', !isValid);
    }
};