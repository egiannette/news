// require mongoose
var mongoose = require("mongoose");
// create the schema class
var Schema = mongoose.Schema;

// create the note schema
var NoteSchema = new Schema({
	// a string
	title:{
		type: String
	},
	body:{
		type: String
	}
});

var Note = mongoose.model("Note", NoteSchema);

// export the note model
module.exports = Note;