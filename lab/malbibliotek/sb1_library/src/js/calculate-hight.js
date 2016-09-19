$(function() {

    var temp =  0, 
        heighest = 0,
        elm = $('.comparison-card');    
    
    var init = {
        
        calculateHight: function (){

            elm.each(function() {
  
                temp = elm.height();
                if(temp >= heighest){
                    heighest = temp;
                }
            })

            this.setHight();
        },
        setHight: function() {
        
            elm.each(function(i, e) {
                $(this).css({height: heighest + 'px'});      
            })
        }
    }
    
    init.calculateHight();
    
})