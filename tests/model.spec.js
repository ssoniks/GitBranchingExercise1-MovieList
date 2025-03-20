const chai = require("chai");
const expect = chai.expect;
const mongoose = require("mongoose");
const ValidationError = mongoose.Error.ValidationError;

require("dotenv").config();

let Movie = require("../models/movie");

describe("Movie Model", () => {
    let movieMock;

    before(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {});
    });

    after(async () => {
        await Movie.deleteMany();
        await mongoose.disconnect();
    });

    beforeEach(() => {
        movieMock = {
            title: "fake movie",
            genre: "fake genre",
            releaseYear: 2023,
            director: "fake director",
            rating: 5
        };
    });

    it("should throw an error due to missing fields", async () => {
        let movie = new Movie();
        try {
            await movie.validate();
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
            expect(err.errors.title).to.exist;
            expect(err.errors.genre).to.exist;
            expect(err.errors.releaseYear).to.exist;
            expect(err.errors.director).to.exist;
        }
    });
    
    it("should create the item successfully", async () => {
        let movie = new Movie(movieMock);
        await movie.validate();
        
        expect(movie.title).to.equal(movieMock.title);
        expect(movie.genre).to.equal(movieMock.genre);
        expect(movie.releaseYear).to.equal(movieMock.releaseYear);
        expect(movie.director).to.equal(movieMock.director);
        expect(movie.rating).to.equal(movieMock.rating);
    });
});
