window.jQuery = window.$ = require('jquery');

//plugins declearing
//require('./plugins/sb1_form_validation');
require('./plugins/jquery-columns-plugin');
require('./plugins/section_appender');
require('./plugins/toggleAttribute');
require('./plugins/scroll-detect');

//Common declearing
var pageState               = require('./common/page-state');
var directives              = require('./common/directives');
var toTop                   = require('./common/to-top');
var contact                 = require('./common/contact');
var scrollReveal            = require('./common/scroll-reveal');
var footer                  = require('./common/footer');
var customerService         = require('./common/customer-service');
var globalMessages          = require('./common/global-messages');
var header                  = require('./common/header');
var localBankPage           = require('./common/local-bank-page');
var iWant                   = require('./common/i-want');
var productOverview         = require('./common/product-overview');

//Components declearing
var ibanGenerator           = require('./components/iban-generator');
var question                = require('./components/question');
var priceList               = require('./components/price-list');
var faq                     = require('./components/faq');
var carousel                = require('./components/carousel');
var tabs                    = require('./components/tabs');
var overviewList            = require('./components/overview-list');
var feedback                = require('./components/feedback');
var productList             = require('./components/product-list');
var highlightedProducts     = require('./components/highlighted-products');
var video                   = require('./components/video');
var progressiveDisclosure   = require('./components/progressive-disclosure');
var stepByStep              = require('./components/step-by-step');
var textTiles               = require('./components/text-tiles');
var buttonOverlay           = require('./components/button-overlay');
var form                    = require('./components/form/form');
var formMultistep           = require('./components/form/form-multistep');
var maps                    = require('./components/google-maps');
var bankPicker              = require('./components/bank-picker');
var condition               = require('./components/condition');
var table                   = require('./components/table');

$(document).ready(function() {
    // Pre-requisites
    pageState();
    
    //Components loading
    ibanGenerator();
    question();
    faq();
    priceList();
    carousel();
    tabs();
    overviewList();
    feedback();
    productList();
    highlightedProducts();
    video();
    progressiveDisclosure();
    stepByStep();
    textTiles();
    buttonOverlay();
    maps();
    bankPicker();
    condition();
    table();
    form();
    formMultistep();

    //Common loading
    iWant();
    directives();
    toTop();
    contact();
    scrollReveal();
    footer();
    customerService();
    globalMessages();
    header();
    localBankPage();
    productOverview();
});
