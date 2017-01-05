const   express                 = require("express"),
        mongoose                = require("mongoose"),
        passport                = require("passport"),
        bodyParser              = require("body-parser"),
        LocalStrategy           = require("passport-local"),
        passportLocalMongoose   = require("passport-local-mongoose"),
        //Import Mongoose Models
        User                    = require("./models/user");
        
mongoose.connect("mongodb://localhost/auth_demo");
mongoose.Promise = global.Promise;
//APP CONFIG
var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "Go Cubs Go",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());
//Encode and de-encode the the data from the session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=================================
//          ROUTES
//=================================

//Index Route
app.get("/", (req, res) => res.render("home"));

app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret");
});

app.get("/register", (req, res) => res.render("register"));

app.post("/register", (req, res) => {
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secret");
            });
        }
    });
});

app.get("/login", (req, res) => res.render("login"));

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {
});

app.get("/logout", (req, res) => {
    //passport will empty the user data in the session
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, () => console.log("Server is listening....."));