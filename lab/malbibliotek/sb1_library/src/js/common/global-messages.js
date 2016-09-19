module.exports = function() {

	function isLocalStorageAvailable() {
		if( typeof(Storage) !== "undefined") {
		    return true;
		} 
		return false;
	}

	function hide(element) {
		element.addClass("hide");
		element.attr("aria-hidden", true);
	}

	function show(element) {
		element.removeClass("hide");
		element.attr("aria-hidden", false);
	}

	function showNextMessage() {
		var globalMessages = $(".global-message li");
		var messageId;
		var message;

		globalMessages.each(function() {
			message = $(this);
			messageId = $(this).attr("data-id"); 

			if (isLocalStorageAvailable()) {

				if ( localStorage.getItem(messageId) !== "1") {
					message.fadeIn("slow", function() {
						show(message);
					});
					// Break out of the loop
					return false;
				}
			}
			else {
				if (!message.hasClass("closed")) {
					show(message);
				
					// Break out of the loop
					return false;
				} 
			}			
		});	
	}

	// Close one message and display the next
	$('.global-message .icon-close').on( 'click', function() {
		var messageElement = $(this).closest("li");

		messageElement.fadeOut("slow", function() {
			hide(messageElement);

			// Don't show the message again
			if ( isLocalStorageAvailable()) {
				var messageId = messageElement.attr('data-id');
				localStorage.setItem(messageId, "1");
			}
			else {
				messageElement.addClass("closed");
			}
			showNextMessage();
		});
		
	});

	// Initially all messages are hidden, display first message
	showNextMessage();
};