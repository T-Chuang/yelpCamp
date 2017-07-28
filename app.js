//////////////  APP SET UP  \\\\\\\\\\\\\\\
const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local')

const   Campground      = require('./models/campground'),
        Comment         = require('./models/comment')
        User            = require('./models/user')
        seedDB          = require('./seeds')

mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))



seedDB()


//////////////  PASSPORT CONFIG  \\\\\\\\\\\\\\\
app.use(require('express-session')({
    secret: '&sDRFcYOx53gt8DE85&CHeXBJ&sDRFcYOx53gt8DE85&CHeXBJ',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware called on every route, creates a local variable to check if logged in user exists
// res.locals.currentUser needs to be set after the passport config but before routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

//////////////  CAMPGROUND ROUTES  \\\\\\\\\\\\\\\

app.get('/', function(req, res){
    res.render('landing')
})

// INDEX - show all campgrounds
app.get('/campgrounds', function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds})
        }
    })
})

// NEW - show form to create new campgrounds
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new.ejs')
})

// CREATE - add new campground to DB
app.post('/campgrounds', function(req, res){
    // collect info from form and add to database
    let name = req.body.name
    let image = req.body.image
    let desc = req.body.description
    let newCampground = {name: name, image: image, description: desc}
    // Create new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            // redirect to campgrounds page
            res.redirect('/campgrounds')
        }
    })
})

// SHOW - more details of a single campground
app.get('/campgrounds/:id', function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            //render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground})
        }
    })

})


//////////////  COMMENTS ROUTES  \\\\\\\\\\\\\\\

// NEW - show form to create new comments
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render('comments/new', {campground: campground})
        }
    })
})

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else {
                    // connect new comment to campground
                    campground.comments.push(comment)
                    campground.save()
                    // redirect to campground's show page
                    res.redirect('/campgrounds/' + campground._id)
                }
            })
        }
    })
})


//////////////  AUTH ROUTES  \\\\\\\\\\\\\\\

// Registeration - show form
app.get('/register', function(req, res){
    res.render('register')
})
// Registeration - logic to add user to DB
app.post('/register', function(req, res){
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('campgrounds')
        })
    })
})

// Login - show form
app.get('/login', function(req, res){
    res.render('login')
})
// Login - checks against existing users
app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failuerRedirect: '/login'
    }), function(req, res){
})

// Log Out
app.get('/logout', function(req, res){
    req.logout()
    res.redirect('/campgrounds')
})


app.get('*', function(req, res){
    res.send('Oops, pages does not exist')
})

app.listen(3000, function(){
    console.log("Yelp Camp server started...")
})
