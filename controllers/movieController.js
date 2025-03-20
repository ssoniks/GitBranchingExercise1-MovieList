const Movie = require("../models/movie");

exports.getMovies = (req, res) => {
        Movie.find()
            .then((movies) => {
                res.render("index", {movies: movies});
                }
            )
            .catch((err) => {
                console.error("Error fetching movies:", err);
                res.status(500).send("Database error: " + err.message); 
            });
};

exports.getAddMoviePage = (req, res) => {
    try {
        res.render("add_movie.ejs");
    } catch (err) {
        res.status(500).send("Error:" + err.message);
    }
};

exports.getEditMoviePage = (req, res) => {
    const movieID = req.params.id
    Movie.findById(movieID)
        .then((movie) => res.render("edit_movie.ejs", {movie: movie}))
        .catch((err) => {
            console.error("Error fetching movie by ID:", err);
            res.status(500).send("Database error: " + err.message);
        });
};

exports.createOrUpdateMovie = (req, res) => {
    if (req.body._id) {
        Movie.findByIdAndUpdate(req.body._id, req.body)
            .then((result) => res.redirect("/"))
            .catch((err) => res.status(500).send("Database error: " + err.message));
    } else {
        const movie = new Movie(req.body);
        console.log(req.body)
        movie.save()
            .then((result) => res.redirect("/"))
            .catch((err) => res.status(500).send("Database error: " + err.message));
    }
};
exports.deleteMovie = (req, res) => {
    const movieID = req.params.id;

    Movie.findByIdAndDelete(movieID)
        .then(() => res.redirect("/"))
        .catch((err) => {
            res.status(500).send("Database error: " + err.message);
        });
};