const express   = require('express')
const router    = express.Router()

const passport  = require('passport')
const User      = require('../models/user')


// Root Route
router.get('/', function(req, res){
    res.render('landing')
})

//////////////  AUTH ROUTES  \\\\\\\\\\\\\\\

// Registeration - show form
router.get('/register', function(req, res){
    res.render('register')
})
// Registeration - logic to add user to DB
router.post('/register', function(req, res){
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('campgrounds')
        })
    })
})

// Login - show form
router.get('/login', function(req, res){
    res.render('login')
})
// Login - checks against existing users
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failuerRedirect: '/login'
    }), function(req, res){
})

// Log Out
router.get('/logout', function(req, res){
    req.logout()
    res.redirect('/campgrounds')
})

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router
