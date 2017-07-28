const express   = require('express')
const router    = express.Router({mergeParams: true})

const   Campground      = require('../models/campground'),
        Comment         = require('../models/comment')

//////////////  COMMENTS ROUTES  \\\\\\\\\\\\\\\

// NEW - show form to create new comments
router.get('/new', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render('comments/new', {campground: campground})
        }
    })
})

// Creates and adds comment to DB
router.post('/', isLoggedIn, function(req, res){
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
                    // add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // saves comment to DB
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    // redirect to campground's show page
                    res.redirect('/campgrounds/' + campground._id)
                }
            })
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
