module.exports = function() {

    var temp            =  0,
        elm             = $('.card-fixed'),
        list            = $('.card-list');

    var init = {

        calculateHeight: function (){
            clearTimeout(timeoutID);
            elm.css({height: 'auto'});
            
            var tallest = 0;
            elm.each(function() {
                temp = $(this).innerHeight();
                if(temp >= tallest){
                    tallest = temp;
                }
            });
            this.setHeight(tallest);
        },

        setHeight: function(tallest) {

            elm.each(function () {
                $(this).css({height: tallest + 'px'});
            });
            
            this.showList();
        },
        
        showList: function () {      
            list.addClass('show');
        }   
    };

    //set timeout is put so content in cards is loaded before the height is set.
    var timeoutID = setTimeout(function() {
        init.calculateHeight();
    }, 100);

};