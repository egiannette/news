var mongoose = require("mongoose");
// creats the schema class
var Schema = mongoose.Schema;

// creats article schema
var ArticleSchema = new Schema({
	// title is a required string
	title:{
		type: String,
		required: true
	},
	// link is a required string
	link:{
		type: String,
		required: true
	},


	// note:{
	// 	type:Schema.Types.ObjectId, 
	// 	ref:"Note"
	// }
});

// create the article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;