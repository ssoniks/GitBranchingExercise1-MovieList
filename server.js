const express = require("express");
const mongoose = require('mongoose');
const app = express();
const Movie = require('./models/movie')

app.set('view engine', 'ejs');

//database connection
const URI = "mongodb+srv://leicho123:not_circumsized@movielist.qapw5.mongodb.net/?retryWrites=true&w=majority&appName=MovieList";
mongoose.connect(URI)
    .then((result) => {console.log('connected to database'), app.listen(3000)})
    .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

app.get('/edit-movie/:id', (req, res) => {
    const movieID = req.params.id
    Movie.findById(movieID)
        .then((result) => res.render("edit_movie.ejs", {movie: result}))
        .catch((err) => {
            console.log(err)
        });
});

app.post('/', (req, res) => {
    console.log(req.body);
    if (req.body._id) {
        console.log("_id is provided");
        Movie.findByIdAndUpdate(req.body._id, req.body)
            .then((result) => res.redirect("/"))
            .catch((err) => console.log(err));
    } else {
        const movie = new Movie(req.body);
        movie.save()
            .then((result) => res.redirect("/"))
            .catch((err) => console.log(err));
    }
});

app.get('/delete-movie/:id', (req, res) => {
    const movieID = req.params.id;
    
    Movie.findByIdAndDelete(movieID)
        .then((result) => res.redirect("/"))
        .catch((err) => console.log(err));
    
});