// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the comment schema
var NoteSchema = new Schema({
    // The comment text
    body: {
        type: String
    }
});

// Mongoose will automatically save the ObjectIds of the comments
// These ids are referred to in the Headline model

// Create the Comment model with the CommentSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Comment model
module.exports = Note;