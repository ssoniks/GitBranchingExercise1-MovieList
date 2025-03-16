const Movie = require("../models/movie");

exports.getMovies = (req, res) => {
        Movie.find()
            .then((movies) => res.render("index", {movies: movies}))
            .catch((err) =>console.log(err));
};

exports.getAddMoviePage = (req, res) => {
    res.render("add_movie.ejs");
};

exports.getEditMoviePage = (req, res) => {
    const movieID = req.params.id
    Movie.findById(movieID)
        .then((movie) => res.render("edit_movie.ejs", {movie: movie}))
        .catch((err) =>console.log(err));
};

exports.createOrUpdateMovie = (req, res) => {
    if (req.body._id) {
        Movie.findByIdAndUpdate(req.body._id, req.body)
            .then((result) => res.redirect("/"))
            .catch((err) => console.log(err));
    } else {
        const movie = new Movie(req.body);
        movie.save()
            .then((result) => res.redirect("/"))
            .catch((err) => console.log(err));
    }
};

exports.deleteMovie = (req, res) => {
    const movieID = req.params.id;
    
    Movie.findByIdAndDelete(movieID)
        .then((result) => res.redirect("/"))
        .catch((err) => console.log(err));
};