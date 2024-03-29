var express     = require("express"),
app             = express(),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
flash           = require("connect-flash"),
passport        = require("passport"),
LocalStrategy   = require("passport-local"),
methodOverride  = require("method-override"),
Campground      = require("./models/campground"),
Comment         = require("./models/comment"),
User            = require("./models/user"),
seedDB          = require("./seed");

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/elp_camp', {useNewUrlParser: true, useFindAndModify:false});
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This text use to encrypt and decrypt code using in session",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

//Check for dislay login logout singin
app.use(function(req, res, next){ // Middleware for every routes
    res.locals.currentUser = req.user; // return current user
    res.locals.success = req.flash("success"); // for flash message
    next(); // next references to route handler
});

app.use(methodOverride("_method"));

//RESTful ROUTE
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//STARTING SERVER
app.listen(8080, function(){
    console.log("NodeJS has started successfully");
});