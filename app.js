const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

let campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?dpr=1&auto=format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop="},
    {name: "Baker's Cove", image: "https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?dpr=1&auto=format&fit=crop&w=1199&h=801&q=80&cs=tinysrgb&crop="},
    {name: "King's Landing", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?dpr=1&auto=format&fit=crop&w=1199&h=911&q=80&cs=tinysrgb&crop="}
]

app.get('/', function(req, res){
    res.render('landing')
})

app.get('/campgrounds', function(req, res){
    res.render('campgrounds', {campgrounds: campgrounds})
})

app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs')
})

app.post('/campgrounds', function(req, res){
    // collect info from form and add to database
    let name = req.body.name
    let image = req.body.image
    let newCampground = {name: name, image: image}
    campgrounds.push(newCampground)
    // update campgrounds page
    res.redirect('/campgrounds')
})

app.get('*', function(req, res){
    res.send('Oops, pages does not exist')
})

app.listen(3000, function(){
    console.log("Yelp Camp server started...")
})
