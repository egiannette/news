// mongodb://heroku_l8df5q7d:2l2f2macimbfa1pq4vohjkgf0p@ds127968.mlab.com:27968/heroku_l8df5q7d
// list all dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
// scrapping tools
var cheerio = require("cheerio");
var request = require("request");
var note = require ("./models/note.js");
var Article = require("./models/article.js");
// using express

var Promise = require("bluebird");

mongoose.Promise = Promise;
var app = express();

// uses pody parser
app.use(bodyParser.urlencoded({extended: false
}));

// make public a static dir
app.use(express.static("public"));

// database config with mongoose
mongoose.connect("mongodb://localhost/newsTest")
// find out what the config needs to be
var db = mongoose.connection;

// show any mongoose errors
db.on("error", function(error){
	console.log("mongoose error:",error);
});
// log a success message
db.once("open", function(){
	console.log("mongoose was connected successfully");
});

// routes

// simple index route
app.get("/", function(req,res){
	res.send(index.html);
});

// GET request to scrape the kxan site
app.get("/scrape", function(req,res){
	request("http://kxan.com/", function(error, response, html){

		var $ = cheerio.load(html);
		$("article h1").each(function(i, element){

			var result ={};

			result.title = $(this).children("a").text(); 
			result.link = $(this).children("a").attr("href");

			var entry = new Article(result);

			entry.save(function(err, doc) {
				if(err){
					console.log(err);
				}
				else{
					console.log(doc);
				}
			});
		});
	});
	res.send("Scrape Complete");
});

app.get("/articles", function(req, res){
	Article.find({}, function(error, doc) {
		if(error){
			console.log(error);
		}
		else{
			res.json(doc);
		}
	});
});

//Is this function necessary
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
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


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
