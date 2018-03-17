// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create Headline schema
var HeadlineSchema = new Schema({
    // title is a required string
    title: {
        type: String,
        required: true,
        unique: true
    },
    // description is a required string
    description: {
        type: String,
        required: true,
        unique: true
    },
    // url: {
    //     type: String,
    //     required: true
    //     // unique: true
    // },
    // boolean to flag headlines as saved
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    // This will save an array of comments' ObjectIds
    notes:[{
        type: Schema.ObjectId,
        ref:'Note'
    }]
});

// Create the Headline model with the Headine Schema
var Headline = mongoose.model("Headline", HeadlineSchema);

// Export the model
module.exports = Headline;