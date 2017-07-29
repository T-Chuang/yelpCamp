//////////////  APP SET UP  \\\\\\\\\\\\\\\
const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        methodOverride  = require('method-override'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local')

const   Campground      = require('./models/campground'),
        Comment         = require('./models/comment')
        User            = require('./models/user')
        seedDB          = require('./seeds')

const   indexRoutes      = require('./routes/index'),
        campgroundRoutes = require('./routes/campgrounds'),
        commentRoutes    = require('./routes/comments')

mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))

// seedDB()

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


//////////////  ROUTES  \\\\\\\\\\\\\\\
app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

app.get('*', function(req, res){
    res.send('Oops, pages does not exist')
})

app.listen(3000, function(){
    console.log("Yelp Camp server started...")
})
