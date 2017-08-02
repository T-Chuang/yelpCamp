///////////////// ALL MIDDLEWARE \\\\\\\\\\\\\\\\\\\
const   Campground      = require('../models/campground'),
        Comment         = require('../models/comment')

const middlewareObj = {
    
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error', 'You need to log in before you can do that!')
        res.redirect('/login')
    },

    checkCampgroundOwnership: function(req, res, next){
        if(req.isAuthenticated()){
                Campground.findById(req.params.id, function(err, foundCampground){
                    if(err){
                        req.flash('error','Sorry, campground not found.')
                        res.redirect('back')
                    } else {
                        // does user own this campground?
                        if(foundCampground.author.id.equals(req.user.id)){
                            next()
                        } else {
                            req.flash('error','You don\'t have permission to do that.' )
                            res.redirect('back')
                        }
                    }
                })
        } else {
            req.flash('error', 'You need to log in before you can do that!')
            res.redirect('back')
        }
    },

    checkCommentOwnership: function(req, res, next){
        if(req.isAuthenticated()){
                Comment.findById(req.params.comment_id, function(err, foundComment){
                    if(err){
                        req.flash('error','Sorry, comment not found.')
                        res.redirect('back')
                    } else {
                        // does user own this comment?
                        if(foundComment.author.id.equals(req.user.id)){
                            next()
                        } else {
                            req.flash('error','You don\'t have permission to do that.' )
                            res.redirect('back')
                        }
                    }
                })
        } else {
            req.flash('error', 'You need to log in before you can do that!')
            res.redirect('back')
        }
    }

}

module.exports = middlewareObj