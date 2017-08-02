///////////////// ALL MIDDLEWARE \\\\\\\\\\\\\\\\\\\
const   Campground      = require('../models/campground'),
        Comment         = require('../models/comment')

const middlewareObj = {
    
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/login')
    },

    checkCampgroundOwnership: function(req, res, next){
        if(req.isAuthenticated()){
                Campground.findById(req.params.id, function(err, foundCampground){
                    if(err){
                        res.redirect('back')
                    } else {
                        // does user own this campground?
                        if(foundCampground.author.id.equals(req.user.id)){
                            next()
                        } else {
                            res.redirect('back')
                        }
                    }
                })
        } else {
            res.redirect('back')
        }
    },

    checkCommentOwnership: function(req, res, next){
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

}

module.exports = middlewareObj