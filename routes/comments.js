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

// CREATE - adds comment to DB
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

// EDIT - user's comments form
router.get('/:comment_id/edit', checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back')
        } else {
        res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
        }
    })
})

// UPDATE - user's comment on DB
router.put('/:comment_id', checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res,redirect('back')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY - deletes comment from DB
router.delete('/:comment_id', checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

//////////////  Middleware  \\\\\\\\\\\\\\\
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect('back')
                } else {
                    // does user own this comment?
                    if(foundComment.author.id.equals(req.user.id)){
                        next()
                    } else {
                        res.redirect('back')
                    }
                }
            })
        } else {
            res.redirect('back')
        }
}

module.exports = router
