const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/", movieController.getMovies);

router.get("/add-movie", movieController.getAddMoviePage);

router.get("/edit-movie/:id", movieController.getEditMoviePage);

router.post("/", movieController.createOrUpdateMovie);

router.get("/delete-movie/:id", movieController.deleteMovie);

module.exports = router;