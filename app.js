var express = require('express')
var app = express()
app.set('view engine', 'ejs')

app.get('/', function(req, res){
    res.render('landing')
})

app.get('/campgrounds', function(req, res){
    var campgrounds = [
        {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?dpr=1&auto=format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop="},
        {name: "Baker's Cove", image: "https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?dpr=1&auto=format&fit=crop&w=1199&h=801&q=80&cs=tinysrgb&crop="},
        {name: "King's Landing", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?dpr=1&auto=format&fit=crop&w=1199&h=911&q=80&cs=tinysrgb&crop="}
    ]

    res.render('campgrounds', {campgrounds: campgrounds})
})

app.get('*', function(req, res){
    res.send('Oops, pages does not exist')
})

app.listen(3000, function(){
    console.log("Yelp Camp server started...")
})
