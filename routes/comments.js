const express   = require('express')
const router    = express.Router({mergeParams: true})

const   Campground      = require('../models/campground'),
        Comment         = require('../models/comment'),
        middleware      = require('../middleware')

//////////////  COMMENTS ROUTES  \\\\\\\\\\\\\\\

// NEW - show form to create new comments
router.get('/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash('error', err.message)
        } else {
            res.render('comments/new', {campground: campground})
        }
    })
})

// CREATE - adds comment to DB
router.post('/', middleware.isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash('error', err.message)
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error','Something went wrong.')
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // saves comment to DB
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    // redirect to campground's show page
                    req.flash('success','Added your comment, thank you for sharing')
                    res.redirect('/campgrounds/' + campground._id)
                }
            })
        }
    })
})

// EDIT - user's comments form
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back')
        } else {
        res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
        }
    })
})

// UPDATE - user's comment on DB
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res,redirect('back')
        } else {
            req.flash('success','Comment updated, thanks!')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY - deletes comment from DB
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back')
        } else {
            req.flash('success','Comment deleted')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})


module.exports = router
