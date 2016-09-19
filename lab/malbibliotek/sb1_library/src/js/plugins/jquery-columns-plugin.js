(function($){

    jQuery.fn.cols = function(numColumns, target, sort) {

        function chunk (arr, numberOfChunks) {

            var chunks = [],
                i = 0,
                n = arr.length;

            var closestDivisibleNum = n;
            while (closestDivisibleNum % 2 !== 0) {
                closestDivisibleNum++;
            }

            var chunkSize = closestDivisibleNum / numberOfChunks;

            while (i < n) {
                chunks.push(arr.slice(i, i += chunkSize));
            }

            return chunks;
        }
        
        
        // Turns an array list of UL elements into html
        function createHTML(list){
            var html = '';
            if(list !== undefined){
                for (var i = 0; i < list.length; i++) {
                    html += '<li>' + list[i] + '</li>';
                }
            }
            return html;
        }

        //Iterate through each match and apply
        $(this).each(function () {
            //Get the current class, so we can add it
            //to the new ULs we will create.
            var curClass = $(this).attr('class');
            if (curClass === undefined) {
                curClass = "";
            } else {
                curClass = "class='" + curClass + "' ";
            }

            //Create array of all posts in lists
            var liArr = [];
            $(this).find('li').each(function(){
                if(!$(this).hasClass('hide')){
                    liArr.push($(this).html());
                }
            });
 
            if($(this).find('li').hasClass('sort')){
                liArr.sort();
            }
            
            //add the HTML back to the dom tree
            var arrayChunks = chunk(liArr, numColumns);
            var newHtml = "";
            for (var i = 0; i < numColumns ;i++) {
                newHtml = newHtml + '<ul ' + curClass + '>' + createHTML(arrayChunks[i]) + '</ul>';
            }
            $(target).remove('ul');
            $(target).html(newHtml);
        });

    };
})(jQuery);
