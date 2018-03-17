var express = require('express');
var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Headline = require("../models/Headline.js");
var router = express.Router();
var axios = require("axios");

// ============= ROUTES FOR HOME PAGE =============//

// Scrape data from Bakersfield website and save to mongodb
//
// router.get("/scrape", function(err, res){
//     console.log("Scraping!");
//     var results = [];
//     var bakersfield = "http://www.bakersfield.com/news/breaking/"
//     axios.get(bakersfield).then(function(response){
//         var $ = cheerio.load(response.data)
//         var parentSelector = ".card-panel";
//         $(parentSelector).each(function(i, element){
//             results.push({
//                 url: $(element).find("a").attr("href"),
//                 title: $(element).find(".card-headline").text().trim(),
//                 description: $(element).find(".card-lead").text().trim()
//             })
//         });
//
//
//     res.send(results);
//     console.log("done scraping");
//     });




// Scrape data from NPR website and save to mongodb
    router.get("/scrape", function(req, res) {
        // Grab the body of the html with request
        request("http://www.bakersfield.com/news/breaking/", function(error, response, html) {
            // Load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Grab every part of the html that contains a separate article
            $("div.card-panel > article").each(function(i, element) {

                // Save an empty result object
                var result = {};

                // Get the title and description of every article, and save them as properties of the result object
                // result.title saves entire <a> tag as it appears on NPR website
                result.title = $(element).find(".card-headline").text().trim();
                // result.description saves text description
                result.description = $(element).find(".card-lead").text().trim();

                // Using our Article model, create a new entry
                var entry = new Headline;

                // Now, save that entry to the db
                entry.save(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
                });

            });
            // Reload the page so that newly scraped articles will be shown on the page
            res.redirect("/");
        });
    });


// This will get the headlines we scraped from the mongoDB
router.get("/headlines", function(req, res) {
    // Grab every doc in the headlines array
    Headline.find({})
    // Execute the above query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

// Save an headline
router.post("/save/:id", function(req, res) {
    // Use the headline id to find and update it's saved property to true
    Headline.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
    // Execute the above query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            // Log result
            else {
                console.log("doc: ", doc);
            }
        });
});


// ============= ROUTES FOR SAVED HEADLINES PAGE =============//

// Grab an headlines by it's ObjectId
router.get("/headlines/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Headline.findOne({ "_id": req.params.id })
    // ..and populate all of the comments associated with it
        .populate("comments")
        // now, execute our query
        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

// Create a new comment
router.post("/comment/:id", function(req, res) {
    // Create a new comment and pass the req.body to the entry
    var newNote = new Note(req.body);
    // And save the new comment the db
    newNote.save(function(error, newNote) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Otherwise
        else {
            // Use the headline id to find and update it's comment
            Headline.findOneAndUpdate({ "_id": req.params.id }, { $push: { "note": newNote._id }}, { new: true })
            // Execute the above query
                .exec(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("doc: ", doc);
                        // Or send the document to the browser
                        res.send(doc);
                    }
                });
        }
    });
});

// Remove a saved headline
router.post("/unsave/:id", function(req, res) {
    // Use the headline id to find and update it's saved property to false
    Headline.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
    // Execute the above query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            // Log result
            else {
                console.log("Headline Removed");
            }
        });
    res.redirect("/saved");
});


module.exports = router;