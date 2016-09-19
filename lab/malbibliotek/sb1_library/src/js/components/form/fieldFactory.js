/*jslint latedef: false*/
var _ = require("underscore");

//var UploadFieldView = require("sb1/common/formsgen/fields/uploadFieldView");
var TextFieldView = require("./fields/textFieldView");
//var DynamicMessageTextFieldView = require("sb1/common/formsgen/fields/dynamicMessageTextFieldView");
var PostalCodeFieldView = require("./fields/postalCodeFieldView");
//var SingleCheckboxFieldView = require("sb1/common/formsgen/fields/singleCheckboxFieldView");
//var BinaryRadiobuttonFieldView = require("sb1/common/formsgen/fields/binaryRadiobuttonFieldView");
var AccountNumberTextFieldView = require("./fields/accountNumberTextFieldView");
var EmailTextFieldView = require("./fields/emailTextFieldView");
//var OtherOrganisationTextFieldView = require("sb1/common/formsgen/fields/otherOrganisationTextFieldView");
//var StaticTextFieldView = require("sb1/common/formsgen/fields/staticTextFieldView");
var DropDownFieldView = require("./fields/dropdownFieldView");
var DateFieldView = require("./fields/dateFieldView");
//var FromToDateFieldView = require("sb1/common/formsgen/fields/fromToDateFieldView");
//var AmountAndCurrencyFieldView = require("sb1/common/formsgen/fields/amountAndCurrencyFieldView");
var MobilePhoneNumberFieldView = require("./fields/mobilePhoneNumberFieldView");
//var OtherPrefixedMobilePhoneNumberFieldView = require("sb1/common/formsgen/fields/prefixedMobilePhoneNumberFieldView");
//var GuaranteeCreditorFieldView = require("sb1/common/formsgen/fields/guaranteeCreditorFieldView");
//var GuaranteeCreditorOptions = require("sb1/common/formsgen/fields/guaranteeCreditorOptions");
//var PersonInfoFieldView = require("sb1/common/formsgen/fields/personInfoFieldView");
//var SSNFieldView = require("sb1/common/formsgen/fields/ssnFieldView");
var RadioFieldView = require("./fields/radioFieldView");
var CheckboxFieldView = require("./fields/checkboxFieldView");
//var AgreementFieldView = require("sb1/common/formsgen/fields/agreementFieldView");
//var PersonInfoFirstAndLastNameFieldView = require("sb1/common/formsgen/fields/personInfoFirstAndLastNameFieldView");

// exclude chr 0-31, lt/gt chars
var REGEX_TEXTFIELD = /^[^\u0000-\u001f\u003c\u003e\u00A8\u00A4]*$/;
// same but allow also crlf
var REGEX_TEXTAREA = /^[^\u0000-\u0009\u000b\u000c\u000e-\u001f\u003c\u003e\u00A8\u00A4]*$/;

var REGEX_PHONE = /^(\+\d)?\d{8,}$/;

/* jshint maxlen: false */
var REGEX_EMAIL = /^[a-zA-Z\u00e5\u00e6\u00f8\u00c5\u00c6\u00d80-9._%+-]+@[a-zA-Z\u00e5\u00e6\u00f8\u00c5\u00c6\u00d80-9-]+(\.[a-zA-Z\u00e5\u00e6\u00f8\u00c5\u00c6\u00d80-9-]+)*(\.[a-zA-Z]{2,63})$/;

var factory = {

    createView: function (el) {
        var fieldFactories = {
            //"AccountsDropDownField": this.createAccountNumberField,
            "account-number": accountNumberTextField,
            "textfield": createTextField,
            //"SingleCheckboxField": this.createSingleCheckboxField,
            "textarea": createTextAreaField,
            //"OrganisationDropDownField": this.organisationField,
            "phone-number": createMobilePhoneNumberField,
            //"PersonInfoFirstAndLastNameField": this.createPersonInfoFirstAndLastNameField,
            //"FirstNameField": this.createTextField,
            //"LastNameField": this.createTextField,
            //"FullNameField": this.createFullNameField,
            //"StreetAddressField": this.createStreetAddressField,
            //"HomeTownField": this.homeTownField,
            "postal-code": postalCodeField,
            //"FileUploadField": this.createUploadField,
            "email": createEmailField,
            //"OtherEmailField": this.createOtherEmailField,
            "dropdown": createDropDownFieldView,
            "datepicker": createDateField,
            //"AmountAndCurrencyField": this.createAmountAndCurrencyField,
            //"BinaryRadiobuttonField": this.createBinaryRadiobuttonField,
            //"FromToDateField": this.createFromToDateField,
            //"SSNField": this.createSSNField,
            //"OtherSSNField": this.createOtherSSNField,
            //"OtherMobilePhoneNumberField": this.otherMobilePhoneNumberField,
            //"OtherPrefixedMobilePhoneNumberField": this.otherPrefixedMobilePhoneNumberField,
            //"GuaranteeCreditorField": this.guaranteeCreditorField,
            //"OtherOrganisationNumberField": this.createOtherOrganisationNumberField,
            //"PersonInfoField": this.personInfoField,
            "radio-buttons": createRadioField,
            "checkbox": createCheckboxField,
            "checkbox-group": createCheckboxFieldGroup,
            //"AgreementField": this.createAgreementField,
            //"SupplementaryAgreementField": this.createOtherOrganisationNumberField
        };

        var factory;
        Object.keys(fieldFactories).forEach(function(factoryKey) {
            if ($(el).hasClass(factoryKey)) {
                factory = fieldFactories[factoryKey];
            }
        });

        if (!factory) {
            return;
        }

        return factory.apply(this, arguments);
    }
};

function createDropDownFieldView (el) {

    var id = _.uniqueId("dropdown");
    var $el = $(el);
    $el.find('input').attr('id', id);
    $el.find('label').attr('for', id);
    return new DropDownFieldView( {
        required: $el.find('input').attr('required') !== undefined,
        el: el,
        id: id
    });
}
//createUploadField: function (field, $table) {
//    return new UploadFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        name: field.name,
//        pattern: /^[0-9]*$/
//    }));
//},
//createAccountNumberField: function (field, $table) {
//    return new AccountNumberTextFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: /^\d{4}[ .]?\d{2}[ .]?\d{5}$/
//    }));
//},
function accountNumberTextField (el) {

    var id = _.uniqueId("account-number");
    var $el = $(el);
    $el.find('input').attr('id', id);
    $el.find('label').attr('for', id);
    return new AccountNumberTextFieldView( {
        pattern: /^\d{4}[ .]?\d{2}[ .]?\d{5}$/,
        required: $el.find('input').attr('required') !== undefined,
        el: el,
        id: id
    });
}

function createTextField  (el) {
    var id = _.uniqueId("textfield");
    var $el = $(el);
    $el.find('input').attr('id', id);
    $el.find('label').attr('for', id);
    return new TextFieldView( {
        pattern: REGEX_TEXTFIELD,
        required: $el.find('input').attr('required') !== undefined,
        el: el,
        id: id,
        events: {
            "blur input": "_blurHandler"
        }
    });
}
//createPersonInfoFirstAndLastNameField: function (field, $table) {
//    return new PersonInfoFirstAndLastNameFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: this.REGEX_TEXTFIELD,
//        size: "input3",
//        firstName: formTexts.FIRST_NAME,
//        lastName: formTexts.LAST_NAME,
//        requiredFirst: field.requiredFirst,
//        requiredLast: field.requiredLast,
//        maxlength: 30
//    }));
//},
//createFullNameField: function (field, $table) {
//    return new PersonInfoFirstAndLastNameFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: this.REGEX_TEXTFIELD,
//        size: "input3",
//        firstName: formTexts.FIRST_NAME,
//        lastName: formTexts.LAST_NAME,
//        fullName: true,
//        maxlength: 30
//    }));
//},
function postalCodeField (el) {
    var id = _.uniqueId("postal-code");
    var $el = $(el);
    $el.find('input').attr('id', id);
    $el.find('label').attr('for', id);
    return new PostalCodeFieldView({
        el: el,
        pattern: /^\d{4}$/,
        required: $el.find('input').attr('required') !== undefined,
        id: id
    });
}
//homeTownField: function (field, $table) {
//    return new DynamicMessageTextFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: this.REGEX_TEXTFIELD,
//        message: formTexts.HOMETOWN
//    }));
//},
function createDateField (el) {

    var id = _.uniqueId("date");
    var $el = $(el);
    $el.find('input').attr('id', id);
    $el.find('label').attr('for', id);
    return new DateFieldView({
        el: el,
        pattern: /^([0-3][0-9].[0-1][0-9].(19|20)?[0-9]{2}|[0-3][0-9][0-1][0-9](19|20)?[0-9]{2})$/,
        required: $el.find('input').attr('required') !== undefined,
        id: id
    });
}
//createFromToDateField: function (field, $table) {
//    var fromToDateFieldView = new FromToDateFieldView({
//        el: $("<tr>").appendTo($table),
//        id: _.uniqueId("date"),
//        label: field.label,
//        labelTo: formTexts.DATE_VALID_TO + (!field.required) ? " (" + formTexts.OPTIONAL + ")" : "",
//        helpMessage: field.helpMessage,
//        pdfFieldName: field.pdfFieldName,
//        pattern: /^([0-3][0-9].[0-1][0-9].(19|20)?[0-9]{2}|[0-3][0-9][0-1][0-9](19|20)?[0-9]{2})$/
//    });
//
//    return fromToDateFieldView;
//},
//createSingleCheckboxField: function (field, $table) {
//    return new SingleCheckboxFieldView(this.createBasicFieldOptions(field, $table));
//},
//createBinaryRadiobuttonField: function (field, $table) {
//    var binaryRadiobuttonFieldView = new BinaryRadiobuttonFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        idYes: _.uniqueId("field"),
//        idNo: _.uniqueId("field"),
//        groupName: _.uniqueId("radio"),
//        labelYes: formTexts.COMMON_OPTION_YES,
//        labelNo: formTexts.COMMON_OPTION_NO
//    }));
//
//    return binaryRadiobuttonFieldView;
//},
function createMobilePhoneNumberField (el) {
    var id = _.uniqueId("phone-number");
    var $el = $(el);
    $el.find('input').attr('id', id);
    $el.find('label').attr('for', id);
    return new MobilePhoneNumberFieldView({
        el: el,
        pattern: REGEX_PHONE,
        required: $el.find('input').attr('required') !== undefined,
        id: id
    });
}
//otherMobilePhoneNumberField: function (field, $table) {
//    return new OtherMobilePhoneNumberFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        //+47 followed by 8 digits, just 8 digits, + or 00 followed by at least 7 digits except 47
//        pattern: /^(0047[49]( *\d *){7}|(\+47)[49]( *\d *){7}|[49]( *\d *){7}|(\+(?!47)|00(?!47))( *\d *){7,})$/
//    }));
//},
//otherPrefixedMobilePhoneNumberField: function (field, $table) {
//    return new OtherPrefixedMobilePhoneNumberFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: this.REGEX_PHONE
//    }));
//},
//organisationField: function (field, $table) {
//    return new OtherOrganisationTextFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: /^(\d{9}(\d{2})?)?$/ // 0, 9 or 11 digits
//    }));
//},
function createEmailField(el) {
    var id = _.uniqueId("email");
    var $el = $(el);
    $el.find('input').attr('id', id);
    $el.find('label').attr('for', id);
    return new EmailTextFieldView({
        el: el,
        pattern: REGEX_EMAIL,
        maxlength: 60,
        required: $el.find('input').attr('required') !== undefined,
        id: id
    });
}
//createOtherEmailField: function (field, $table) {
//    return new EmailTextFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: this.REGEX_EMAIL,
//        maxlength: 60
//    }));
//},
function createTextAreaField(el) {
    var id = _.uniqueId("textarea");
    var $el = $(el);
    $el.find('textarea').attr('id', id);
    $el.find('label').attr('for', id);
    return new TextFieldView( {
        pattern: REGEX_TEXTAREA,
        required: $el.find('textarea').attr('required') !== undefined,
        el: el,
        id: id,
        events: {
            "blur textarea": "_blurHandler"
        }
    });
}
//createStaticTextField: function (field, $table) {
//    return new StaticTextFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//    }));
//},
//createAmountAndCurrencyField: function (field, $table) {
//    return new AmountAndCurrencyFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        options: field.options,
//        pattern: /^[0-9]*$/
//    }));
//},
//createSSNField: function (field, $table) {
//    return new SSNFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: /^[0-7]\d[01]\d\d{7}$/,
//        size: "input3"
//    }));
//},
//createOtherSSNField: function (field, $table) {
//    return new SSNFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        size: "input3",
//        pattern: /^[0-7]\d[01]\d\d{7}$/
//    }));
//},
//guaranteeCreditorField: function (field, $table) {
//    var required = field.required;
//    var first = true;
//    var helpMessage = field.helpMessage;
//    var createdFields = _.map(GuaranteeCreditorOptions.getOptions(), function (field) {
//        field.required = required;
//        if (first) {
//            field.helpMessage = helpMessage;
//            first = false;
//        }
//        return this.createView(field, $table);
//    }, this);
//
//    return new GuaranteeCreditorFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        fields: createdFields
//    }));
//},
//personInfoField: function (field, $table) {
//    var that = this;
//
//    var createViewFunction = function (field, $table) {
//        return that.createView(field, $table);
//    };
//
//    return new PersonInfoFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        createViewFunctionReference: createViewFunction,
//        name: field.name,
//        max: field.max,
//        firstNameRequired: field.firstnameRequired,
//        lastNameRequired: field.lastnameRequired,
//        ssnRequired: field.ssnRequired,
//        emailRequired: field.emailRequired,
//        mobileRequired: field.mobileRequired
//    }));
//},
//createOtherOrganisationNumberField: function (field, $table) {
//    return new OtherOrganisationTextFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: /^(\d{9}(\d{2})?)?$/ // 0, 9 or 11 digits
//    }));
//},
function createRadioField (el) {
    var id = _.uniqueId("radios");
    var $el = $(el);

    $el.find('li').each(function (index, element) {
        var id = _.uniqueId("radio");
        $(element).find('input').attr('id', id);
        $(element).find('label').attr('for', id);
    });

    $el.find('input').attr('name', id);

    return new RadioFieldView( {
        required: $el.find('ul').attr('required') !== undefined,
        el: el,
        groupName: id
    });
}
function createCheckboxField (el) {
    var id = _.uniqueId("checkbox");
    var $el = $(el);
    $el.find('input').attr('id', id);
    $el.find('input').attr('name', id);
    $el.find('label').attr('for', id);
    return new CheckboxFieldView( {
        required: $el.find('input').attr('required') !== undefined,
        el: el,
        groupName: id
    });
}

function createCheckboxFieldGroup (el) {
    var id = _.uniqueId("checkbox-group");
    var $el = $(el);

    $el.find('li').each(function (index, element) {
        var id = _.uniqueId("checkbox");
        $(element).find('input').attr('id', id);
        $(element).find('label').attr('for', id);
    });

    $el.find('input').attr('name', id);
    return new CheckboxFieldView( {
        required: $el.find('ul').attr('required') !== undefined,
        el: el,
        groupName: id
    });
}
//createAgreementField: function (field, $table) {
//    return new AgreementFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: this.REGEX_TEXTFIELD
//    }));
//},
//createStreetAddressField: function (field, $table) {
//    return new DynamicMessageTextFieldView(_.extend(this.createBasicFieldOptions(field, $table), {
//        pattern: this.REGEX_TEXTFIELD,
//        size: "input6",
//        message: formTexts.ADDRESS
//    }));
//}

module.exports = factory;
