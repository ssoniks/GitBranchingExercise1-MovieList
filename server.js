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

    const movieMatrix = new Movie({
        title: "The Matrix",
        genre: "Sci-Fi",
        releaseYear: 1999,
        director: "The Wachowskis",
        rating: 8.7
    });

    movieMatrix.save()
        .then((result) => console.log(result))
        .catch((err) => console.log(err));

    const movieInterstellar = new Movie({
        title: "Interstellar",
        genre: "Sci-Fi",
        releaseYear: 2014,
        director: "Christopher Nolan",
        rating: 8.6
    });

    movieInterstellar.save()
        .then((result) => console.log(result))
        .catch((err) => console.log(err));

    const movieGodfather = new Movie({
        title: "The Godfather",
        genre: "Crime",
        releaseYear: 1972,
        director: "Francis Ford Coppola",
        rating: 9.2
    });

    movieGodfather.save()
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
});