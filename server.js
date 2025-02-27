const express = require("express");
const mongoose = require('mongoose');
const app = express();
const Movie = require('./models/movie')

app.set('view engine', 'ejs');

//database connection
const URI = "mongodb+srv://leicho123:not_circumsized@movielist.qapw5.mongodb.net/?retryWrites=true&w=majority&appName=MovieList";
mongoose.connect(URI)
    .then((result) => console.log('connected to database'))
    .catch((err) => console.log(err));

app.listen(3000);

app.get('/', (req, res) => {

    res.render("index");
});

app.get('/movie', (req, res) => {

    const movie = new Movie({
        title: "Inception",
        genre: "Sci-Fi",
        releaseYear: 2010,
        director: "Christopher Nolan",
        rating: 8.8
    });

    movie.save()
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
});