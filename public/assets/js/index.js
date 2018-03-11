$(document).ready(function() {

    // Responsive hamburger menu
    $(".navbar-burger").on("click", function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".dropdown").toggle();
        $(".dropdown").toggleClass("is-open");
    });

    // Grab the headlines as a json when page loads, append to the page
    $.getJSON("/headlines", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the information on the page
            $("#scrape-results").prepend("<div class='result-div'><p class='result-text'>" +data[i].title + "<br>" + data[i].description +
                "</p><button class='save-headline button is-info is-medium' data-id='" + data[i]._id + "'><span class='icon'><i class='fa fa-bookmark'></i></span>Save headline</button></div>");
        }
    });

    // Save headline button changes the saved property of the headline model from false to true
    $(document).on("click", ".save-headline", function() {
        // change icon to check mark
        $(this).children("span.icon").children("i.fa-bookmark").removeClass("fa-bookmark").addClass("fa-check-circle");
        // Get headline id
        var headlineID = $(this).attr("data-id");
        console.log(headlineID);
        // Run a POST request to update the headline to be saved
        $.ajax({
            method: "POST",
            url: "/save/" + headlineID,
            data: {
                saved: true
            }
        }).done(function(data) {
            // Log the response
            console.log("data: ", data);
        });
    });


});