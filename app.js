var express    = require("express"),
	methodOverride = require("method-override"),
    app        = express(),
	bodyParser     = require("body-parser"),
	mongoose       = require("mongoose");

//CONNECTING TO DATABASE-MONGOOSE
mongoose.connect('mongodb://localhost:27017/letsTalkPeriod_blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//SETTING APPS
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//SCHEMA
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body:String,
	author: String,
	created: {type: Date, default: Date.now} 
})

//MODEL
var Blog = mongoose.model("Blog", blogSchema);



//HOME ROUTE
app.get("/", function(req,res){
	res.render("home");
});

//=========================
//BLOG ROUTES
//=========================
//INDEX
app.get("/blogs",function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!");
		}else{
	        res.render("index", {blogs: blogs});			
		}
	})
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
	//create blog 
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("index");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	//destroy blogs
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});





//starting the server
app.listen(3000, function(){
	console.log("The Server has started!");
});