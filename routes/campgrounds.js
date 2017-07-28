const express   = require('express')
const router    = express.Router()

const   Campground      = require('../models/campground')

//////////////  CAMPGROUND ROUTES  \\\\\\\\\\\\\\\

// INDEX - show all campgrounds
router.get('/', function(req, res){
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
router.get('/new', function(req, res){
    res.render('campgrounds/new.ejs')
})

// CREATE - add new campground to DB
router.post('/', function(req, res){
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
            res.redirect('/')
        }
    })
})

// SHOW - more details of a single campground
router.get('/:id', function(req, res){
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

module.exports = router
