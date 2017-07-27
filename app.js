// APP SETUP
const   express     = require('express'),
        app         = express(),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose')

const   Campground  = require('./models/campground'),
        seedDB      = require('./seeds')

mongoose.connect('mongodb://localhost/yelp_camp', {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

seedDB()


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
            res.render('index', {campgrounds: allCampgrounds})
        }
    })
})

// NEW - show form to create new campgrounds
app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs')
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
    Campground.findById(req.params.id).populate('comments').exec (function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            //render show template with that campground
            res.render('show', {campground: foundCampground})
        }
    })

})

app.get('*', function(req, res){
    res.send('Oops, pages does not exist')
})

app.listen(3000, function(){
    console.log("Yelp Camp server started...")
})
