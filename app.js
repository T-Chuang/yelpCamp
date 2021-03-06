//////////////  APP SET UP  \\\\\\\\\\\\\\\
const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        methodOverride  = require('method-override'),
        flash           =require('connect-flash')
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

// Environment Variable DATABASEURL - local: mongodb://localhost/yelp_camp or 
        // HEROKU: mongodb://tchuang:yelpcamptyc@ds125053.mlab.com:25053/yelpcamp-tyc
mongoose.connect(process.env.DATABASEURL, {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())


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


// res.locals.currentUser needs to be set after the passport config but before routes
app.use(function(req, res, next){
    // Middleware called on every route, creates a local variable to check if logged in user exists
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


//////////////  ROUTES  \\\\\\\\\\\\\\\
app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

app.get('*', function(req, res){
    res.send('Oops, page does not exist')
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Yelp Camp server started...")
})
