/* global $: true */

var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

var QuestionList = function(el) {
    this.el = $(el);
    return this;
};

QuestionList.prototype.filterBy = function(tag) {
    var questions = this.el.find('.question');

    questions.each(function(index, element) {
        var el = $(element);
        if (el.data('tags') !== tag) {
            el.hide();
        } else {
            el.show();
        }
    });
};

describe('QuestionList', function() {
    var el;

    beforeEach(function() {
        el = $('<ul class="question-list"></ul>');
        el.append('<li class="question one" data-tags="fanto"></li>');
        el.append('<li class="question two" data-tags="br"></li>');
    });

    it('hides questions', function() {
        var questionList = new QuestionList(el);
        questionList.filterBy('br');

        expect(el.find('.question.one').attr('style')).toEqual('display: none;');
        expect(el.find('.question.two').attr('style')).toEqual('');
    });

    it('shows questions', function() {
        var questionList = new QuestionList(el);
        questionList.filterBy('br');
        questionList.filterBy('fanto');

        expect(el.find('.question.one').attr('style')).toEqual('');
        expect(el.find('.question.two').attr('style')).toEqual('display: none;');
    });
});