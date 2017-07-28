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


app.get('/', function(req, res){
    res.render('landing')
})

//////////////  CAMPGROUND ROUTES  \\\\\\\\\\\\\\\

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
app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render('comments/new', {campground: campground})
        }
    })
})

app.post('/campgrounds/:id/comments', function(req, res){
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


app.get('*', function(req, res){
    res.send('Oops, pages does not exist')
})

app.listen(3000, function(){
    console.log("Yelp Camp server started...")
})
