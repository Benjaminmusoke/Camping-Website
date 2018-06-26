var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
    
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image:"https://farm6.staticflickr.com/5349/9115889648_9518307558.jpg",
//         description:"This is a huge granite hill, No bathrooms. No water. Beatiful granite!"
        
//     },
//     function(err, campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("NEWLY CREATED CAMPGROUND:  ")
//             console.log(campground);
//         }
//     });

// var campgrounds = [
//     {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4098/4739237081_11f5b8284a.jpg"},
//     {name: "Granite Hill", image:"https://farm6.staticflickr.com/5349/9115889648_9518307558.jpg"},
//     {name: "Mountain Goat's Rest", image:"https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg"},
//     {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4098/4739237081_11f5b8284a.jpg"},
//     {name: "Granite Hill", image:"https://farm6.staticflickr.com/5349/9115889648_9518307558.jpg"},
//     {name: "Mountain Goat's Rest", image:"https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg"},
//     {name: "Salmon Creek", image:"https://farm5.staticflickr.com/4098/4739237081_11f5b8284a.jpg"},
//     {name: "Granite Hill", image:"https://farm6.staticflickr.com/5349/9115889648_9518307558.jpg"},
//     {name: "Mountain Goat's Rest", image:"https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg"}
// ];

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else {
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name, image:image, description:description};
   //Create a new campground and save to the DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else {
             //redirect back to campgrounds page
           res.redirect("/campgrounds");
        }   
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //Find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
  
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started!!");
});