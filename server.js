const express = require("express");
const mongoose = require('mongoose');
const app = express();
const Movie = require('./models/movie')

app.set('view engine', 'ejs');

//database connection
const URI = "mongodb+srv://leicho123:not_circumsized@movielist.qapw5.mongodb.net/?retryWrites=true&w=majority&appName=MovieList";
mongoose.connect(URI)
    .then((result) => {console.log('connected to database'), app.listen(3000);})
    .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }))    

app.get('/', (req, res) => {
    Movie.find()
        .then((result) => {console.log(result), res.render("index", {movies: result})
        })
        .catch((err) => {
            console.log(err)
        });
});

app.get('/add-movie', (req, res) => {
    res.render("add_movie.ejs");
});

app.post('/', (req, res) => {

    console.log(req.body);
    const movie = new Movie(req.body);

    movie.save()
        .then((result) => res.redirect("/"))
        .catch((err) => console.log(err));
});