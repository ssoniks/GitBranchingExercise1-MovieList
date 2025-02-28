const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    director: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;