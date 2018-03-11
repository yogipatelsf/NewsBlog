
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
const path = require('path');



// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");

// Require all models
var db = require("./models/");
// var db = mongoose.connection;

// Requiring routing controllers
var headlineRouter = require("./controllers/headline.js");
var noteRouter = require("./controllers/note.js");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware


// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Use body parser with the app
app.use(bodyParser.urlencoded({
    extended: false
}));

// Initialize Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Routing
app.use("/", headlineRouter);
app.use("/", noteRouter);

// Make public a static dir
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI), {
    };
}
else {
    mongoose.connect("mongodb://localhost:27017/NewsBlog");
}


// Listen on port 3000
// Start the server
mongoose.connection.on('error', function(err) {
    console.log("Mongoose Error: " + err);
})

mongoose.connection.on('open', function() {
    console.log("Mongoose connection successful.");
    app.listen(PORT, function() {
        console.log("App running on port " + PORT + "!");
    });
});
