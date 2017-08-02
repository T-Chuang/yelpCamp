const express   = require('express')
const router    = express.Router()

const   Campground      = require('../models/campground'),
        middleware      = require('../middleware')

//////////////  CAMPGROUND ROUTES  \\\\\\\\\\\\\\\

// INDEX - show all campgrounds
router.get('/', function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            req.flash('error', err.message)
        } else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds})
        }
    })
})

// NEW - show form to create new campgrounds
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new.ejs')
})

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
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
            req.flash('error', err.message)
        } else {
            req.flash('success','Added new campground. High Five!')
            res.redirect('campgrounds')
        }
    })
})

// SHOW - more details of a single campground
router.get('/:id', function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            req.flash('error', err.message)
        } else {
            //render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground})
        }
    })
})

// EDIT - form to update campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground})
    })
}) 

// UPDATE - updates campground on DB
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash('error', err.message)
            res.redirect('/campgrounds')
        } else {
            req.flash('success','Campground updated, thanks!')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY - delete campground from DB
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash('error', err.message)
            res.redirect('/campgrounds')
        } else {
            req.flash('success','Campground deleted')
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router
