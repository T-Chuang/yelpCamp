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
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new.ejs')
})

// CREATE - add new campground to DB
router.post('/', isLoggedIn, function(req, res){
    // collect info from form and add to database
    let name = req.body.name
    let image = req.body.image
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: image, description: desc, author: author}
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

// EDIT - form to update campground
router.get('/:id/edit', function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect('campgrounds')
        } else {
            res.render('campgrounds/edit', {campground: foundCampground})
        }
    })
})

// UPDATE - updates campground on DB
router.put('/:id', function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY - delete campground from DB
router.delete('/:id', function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds')
        }
    })
})

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}


module.exports = router
