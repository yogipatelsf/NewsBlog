$(document).ready(function() {

    // Responsive hamburger menu
    $(".navbar-burger").on("click", function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".dropdown").toggle();
        $(".dropdown").toggleClass("is-open");
    });

    // Display saved headlines on page load
    $.getJSON("/headlines", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // if headline has been marked as saved
            if (data[i].saved === true) {
                // Display the information on the page
                $("#saved-results").append("<div class='saved-div'><p class='saved-text'>" + data[i].title + "<br>" + data[i].description +
                    "</p><a class='unsave-button button is-danger is-medium' data-id='" +
                    data[i]._id + "'>Remove</a><a class='comments-button button is-info is-medium' data-id='" + data[i]._id +
                    "'><span class='icon'><i class='fa fa-comments'></i></span>Comments</a></div>");
            }
        }
    });

    // Comment button opens the comments modal & displays any comments
    $(document).on("click", ".comments-button", function() {
        // Open the comments modal
        $(".modal").toggleClass("is-active");
        // Get headline by headline ID
        var headlineID = $(this).attr("data-id");
        // Now make an ajax call for the headline
        $.ajax({
            method: "GET",
            url: "/headlines/" + headlineID
        }).done(function(data) {
            // Update modal header
            $("#comments-header").html("headline Comments (ID: " + data._id + ")");
            // If the headline has comments
            if (data.comments.length !== 0) {
                // Clear out the comment div
                $("#comments-list").empty();
                for (i = 0; i < data.comments.length; i++) {
                    // Append all headline comments
                    $("#comments-list").append("<div class='comment-div'><p class='comment'>" + data.comments[i].body + "</p></div>");
                }
            }
            // Append save comment button with headline's ID saved as data-id attribute
            $("footer.modal-card-foot").html("<button id='save-comment' class='button is-success' data-id='" + data._id + "'>Save Comment</button>")
        });
    });

    // Modal X button closes modal and removes comments
    $(document).on("click", ".delete", function() {
        $(".modal").toggleClass("is-active");
        $("#comments-list").html("<p>Write the first comment for this headline.</p>");
    });

    // Saving Comments
    $(document).on("click", "#save-comment", function() {
        // Grab the id associated with the headline from the submit button
        var headlineID = $(this).attr("data-id");
        // Run a POST request to add a comment, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/comment/" + headlineID,
            data: {
                // Value taken from body input
                body: $("#new-comment-field").val()
            }
        }).done(function(data) {
            // Log the response
            console.log("data: ", data);
        });

        // Also, remove the values entered in the inputs for comment entry
        $("#new-comment-field").val("");
        // Close comment modal
        $(".modal").toggleClass("is-active");
    });

    // Deleting Comments
    $(document).on("click", ".delete-comment", function() {
        // delete comment
    });

    // Removing Saved headlines
    $(document).on("click", ".unsave-button", function() {
        // Get headline id
        var headlineID = $(this).attr("data-id");
        console.log(headlineID);
        // Run a POST request to update the headline to be saved
        $.ajax({
            method: "POST",
            url: "/unsave/" + headlineID,
            data: {
                saved: false
            }
        });
    });

});