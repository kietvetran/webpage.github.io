var locationUtil = require('../plugins/locationUtil');

module.exports = function() {
    var questions = $('.question-list .question');
    var questionText = $('.question-list .question-text');
    var tags = $('.tags .tag');
    var subTags = $('.subtags .subtag');
    var subTagWrap = $('.subtags').hide();
    var isSubTagsVisible = false;
    var slideSpeed = 300;

   
    questionText.click( function(e) {
        e.preventDefault();
        
        if( !$(this).closest('.question').hasClass('active') ) {
            locationUtil.deleteParam('qid');
        } else {
            locationUtil.setParam('qid', $(this).closest('.question').data('id'));
        }

    });

    tags.click( function () {
        var tag = $(this);

        if( tag.hasClass('active') ) {
            // clear out filters if tag already highlighted
            clearFilter();
            subTagWrap.fadeOut( slideSpeed);
            
            // delete tag from url
            locationUtil.deleteParam('tag');
        } else {
            // Highlight tag
            tags.removeClass('active');
            subTags.removeClass('active');
            tag.addClass('active');
            
            // filter based on category and subcategory
            filter( tag.data('tag-id') );
            
            // if there are no subtags shown then hide the ul 
            //(remove border with extra margin)
            if( isSubTagsVisible ) {
                subTagWrap.fadeIn( slideSpeed);
            } else {
                subTagWrap.fadeOut( slideSpeed);
            }
            
            // Update url with tag id
            locationUtil.setParam('tag', tag.data('tag-id').split('/')[1] );
        }

    });
    
    subTags.click( function () {

        var subTag = $(this);
        // if tag is active, then clear out the filter 
        // and apply the parent filter
        if( subTag.hasClass('active') ) {

            var parentTag = subTag.attr('data-tag-id').split('/')[1];
            clearFilter();
            // go through each tag and click on if it matches the parent tag
            tags.each( function() {
                var currentTag = $(this).attr('data-tag-id').split('/')[1];
                if( currentTag === parentTag ){
                    // highlight tag
                    $(this).click();
                    // deactivate subtag
                    subTag.removeClass('active');
                }
            });

        } else {
            // Update subtags visually
            subTags.removeClass('active');
            subTag.addClass('active');
            // filter out questions
            filterQnA( subTag.data('tag-id') );
        }
    });
    
    
    var init = function () {

        // check if a tag is present on the url 
        // if so then select the tag
        var urlTag = locationUtil.getParam('tag');
        // If a tag id is present on the url then select it
        if( urlTag ) {
            // go through each tag and click on if it matches the url tag
            tags.each( function() {
                var currentTag = $(this).attr('data-tag-id').split('/')[1];
                if( currentTag === urlTag ){
                    // highlight tag
                    $(this).click();
                }
            });
        }

        // If there is a question on the url then open it in the page
        if( locationUtil.getParam('qid') ) {
        
            $(window).load(function() {
                var question = $('[data-id=' + locationUtil.getParam('qid') + ']');
                question.find('.question-text').trigger('click');
                $('html, body').animate({scrollTop: question.offset().top - $('.header').height()});
            });
        }

    };

    function filter( tagID) {

        filterQnA( tagID);
        filterSubSub( tagID);
    }

    function filterQnA( tagID, clearFilter) {

        questions.each(function(index, element) {

            var $el = $(element);
            if ($el.data('tags').split('|').indexOf(tagID) !== -1 || clearFilter ) {
                $el.show();
            } else {
                $el.hide();            
            }
        });

    }

    function filterSubSub( tagID) {

        isSubTagsVisible = false;

        subTags.each(function(index, element) {

            var $el = $(element);
            if ($el.data('tag-id').indexOf(tagID) !== -1) {
                $el.show();
                isSubTagsVisible = true;
            } else {
                $el.hide();
            }
        });
    }

    function clearFilter() {
    
        tags.removeClass('active');
        subTags.removeClass('active');
        
        // filter without specifying a tag i.e. clear filter
        filterQnA('', true);    
    }

    init();
};
