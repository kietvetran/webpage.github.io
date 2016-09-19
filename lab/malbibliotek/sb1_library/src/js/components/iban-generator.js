var AccountNumber = require('../domain/accountNumber');
var IBAN = require('iban');

module.exports = function() {

    var ibanGenerateInput = $('#iban-account-number'),
        ibanGenerateForm = $('.form-iban-generator'),
        ibanCheckForm = $('.form-iban-checker'),
        ibanCheckInput = $('#iban-check'),
        ibanCheckBtn = $('.iban-check-btn'),
        ibanResultContainer = $('.iban-result-container'),
        ibanResult = $('.iban-result'),
        ibanResultPaper = $('.iban-result-paper');

    ibanCheckBtn.click(function (e) {
        e.preventDefault();
        $(this).toggleClass('open');
        $('.iban-check-section').toggleAttr('aria-expanded').slideToggle();
    });

    ibanCheckInput.on('keyup keypress', function (e) {
        preventSubmit(e);
        if (ibanCheckInput.val().length > 5) {
            checkIBAN(ibanCheckInput.val().toString());
        }
        else{
            ibanCheckInput.removeClass('sb1_form_validation_is_valid sb1_form_validation_has_error');
            ibanCheckForm.removeClass('error');
            $('.iban-check-result').html("");
        }
    });

    ibanGenerateInput.on('keyup keypress', function (e) {
        preventSubmit(e);
        if (ibanGenerateInput.val().length === 11) {
            toIBAN(ibanGenerateInput.val().toString());
        }
        else {
            ibanResultContainer.fadeOut();
            ibanGenerateInput.removeClass('sb1_form_validation_is_valid sb1_form_validation_has_error');
            ibanGenerateForm.removeClass('error');
        }
    });

    function preventSubmit (e) {
        var code = e.keyCode;
        if(code === 13) {
            return e.preventDefault();
        }
    }

    function checkIBAN(iban) {
        if(IBAN.isValid(iban)){
            $('.iban-check-result').html('IBAN-nummer stemmer');
            ibanCheckInput.addClass('sb1_form_validation_is_valid');
            ibanCheckForm.removeClass('error');
        }
        else {
            ibanCheckInput.removeClass('sb1_form_validation_is_valid');
            ibanCheckForm.addClass('error');
            ibanCheckInput.addClass('sb1_form_validation_has_error');
            $('.iban-check-result').html('');
        }

    }

    function toIBAN(accn) {

        var ibanNumber = "", check, kNumber;

        kNumber = ibanGenerateInput.val().toString();
        check = new AccountNumber(kNumber).isValid();

        if(!check || (kNumber === "00000000000")) {
            ibanGenerateForm.addClass('error');
            ibanGenerateInput.addClass('sb1_form_validation_has_error');
        }
        else {
            ibanNumber = IBAN.fromBBAN('NO', accn);
            showResult(ibanNumber);
        }
    }

    function showResult(ibanNumber) {
        ibanResultPaper.html(IBAN.printFormat(ibanNumber, " "));
        ibanResult.html(ibanNumber);
        ibanGenerateInput.addClass('sb1_form_validation_is_valid');
        ibanResultContainer.fadeIn();
    }
};

