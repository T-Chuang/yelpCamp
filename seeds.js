// Sample Data to test app

const mongoose      = require('mongoose')

const Campground    = require('./models/campground')
const Comment       = require('./models/comment')

let campgroundData = [
    {
        name: 'King\'s Landing',
        image: 'http://www.photosforclass.com/download/9667057875',
        description: 'One campground to rule them all'
    },
    {
        name: 'Rockfall',
        image: 'http://www.photosforclass.com/download/35842698552',
        description: 'Hard and wet'
    },
    {
        name: 'Lightning Bay',
        image: 'http://www.photosforclass.com/download/8137270056',
        description: 'Sleep well'
    }
]

function seedDB(){
    // Remove all campgrounds from DB
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
        } else {
            console.log('Removed all campgrounds from DB')
        }
    })

    // Add seed campgrounds to DB
    campgroundData.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if(err){
                console.log(err)
            } else {
                console.log('Added a campground.')
                // Add seed comments
                Comment.create(
                    {
                        text: 'Nature is great, but wish there was internet',
                        author: 'modern human'
                    }, function(err, comment){
                        if(err){
                            console.log(err)
                        } else {
                            campground.comments.push(comment)
                            campground.save()
                            console.log('Created new comment')
                        }
                    }
                )
            }
        })
    })


}

module.exports = seedDB
