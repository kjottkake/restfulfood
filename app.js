var express 	 = require("express"),
methodOverride 	 = require("method-override"),
expressSanitizer = require("express-sanitizer"),
app    			 = express(),
bodyParser   	 = require("body-parser"), 
mongoose    	 = require("mongoose");


mongoose.connect("mongodb://localhost/food_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	created: {type: Date, default: Date.now}
});

var FoodItem = mongoose.model("FoodItem", blogSchema);


// CREATE BLOG LOL DON'T UNCOMMENT THIS LINE DUMBASS
// FoodItem.create({
// 	name: "Ice cream",
// 	image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
// 	description: "Ice cream contains a lot of cream and is cold."
// });


//direct to index 
app.get("/", function(req, res){
	res.redirect("/foods");
})

// INDEX OR HOME ROUTE
app.get("/foods", function(req, res){
	FoodItem.find({}, function(err, foods){
		if(err){
			console.log("ERROR!");
		} else {
			res.render("index", {foods: foods});
		}
	});
});

//	CREATE ROUTE
app.post("/foods", function(req, res){
	FoodItem.create(req.body.food, function(err, newFood){
		if(err){
			console.log("ERROR SOMETHING WITH THE CREATION OF NEW FOOD");
		} else {
			res.redirect("/foods");
		}
	})
});


//EDIT ROUTE
app.get("/foods/:id/edit", function(req,res){
	FoodItem.findById(req.params.id, function(err, foundFood){
		if(err){
			console.log("ERROR SOMETHINGS FUCKY WITH FINDING FOOD");
		} else {
			res.render("edit", {food: foundFood});
		}
	});
});

//	UPDATE ROUTE
app.put("/foods/:id", function(req,res){
	req.body.food.body = req.sanitize(req.body.food.body);
	// Blog.findByIdAndUpdate(id, newData, callback)
	FoodItem.findByIdAndUpdate(req.params.id, req.body.food, function(err,updatedFood){
		if(err){
			res.redirect("/foods");
		} else {
			res.redirect("/foods");
		}
	});
})

// 	DELETE FUCKING ITEM DAWG
app.delete("/foods/:id", function(req,res){
	//destroy item
	FoodItem.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/foods");
		} else {
			res.redirect("/foods");
		}
	})
})



// LAN PORT
var port = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', function(){
	console.log("FOOD SERVER HAS STARTED");
});