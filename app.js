var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    Campground      = require("./models/campground"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    seedDB          = require("./seeds");
    
//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://catapit:easycs@ds135394.mlab.com:35394/yelpcamppit", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
/*seedDB();*/

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Pit is chuby",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.locals.moment = require("moment");

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Require Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("//////////////////////////////////////");
   console.log("The YelpCamp Application has started!");
   console.log("//////////////////////////////////////");
});