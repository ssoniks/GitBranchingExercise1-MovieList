const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Movie = require("../models/movie");
const { expect } = require("chai");

require("dotenv").config();

describe("Movie routes", () => {
    let movieId;

    before(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {});
    });
  
    after(async () => {
        await Movie.deleteMany();
        await mongoose.disconnect();
    });

    describe("GET /", () => {
        it("should fetch all movies", async () => {
            const response = await request(app).get("/").expect(200);
            expect(response.text).to.include("<h1>Welcome to my Movie List!</h1>");
        });
    });

    describe("GET /add-movie", () => {
        it("should render the add movie page", async () => {
            const response = await request(app).get("/add-movie").expect(200);
            expect(response.text).to.include("<h1>Add a new movie to the list!</h1>");
        });
    });

    describe("POST /", () => {
        it("should create a new movie successfully", async () => {
            const newMovie = {
                title: "Test Movie",
                genre: "Test Genre",
                releaseYear: 2024,
                director: "Test Director",
                rating: 5,
            };

            const response = await request(app).post("/").send(newMovie).expect(302);
            expect(response.headers.location).to.equal("/");

            const movie = await Movie.findOne({ title: "Test Movie" });
            expect(movie).to.not.be.null;
            movieId = movie._id;
        });
    });

    describe("GET /edit-movie/:id", () => {
        it("should render the edit movie page", async () => {
            const response = await request(app).get(`/edit-movie/${movieId}`).expect(200);
            expect(response.text).to.include("<h1>Edit a new movie in the list!</h1>");
        });
    });

    describe("POST / (update existing movie)", () => {
        it("should update an existing movie", async () => {
            const updatedMovie = {
                _id: movieId,
                title: "Updated Test Movie",
                genre: "Comedy",
                releaseYear: 2025,
                director: "Updated Director",
                rating: 4,
            };

            const response = await request(app).post("/").send(updatedMovie).expect(302);
            expect(response.headers.location).to.equal("/");

            const movie = await Movie.findById(movieId);
            expect(movie.title).to.equal("Updated Test Movie");
        });
    });

    describe("GET /delete-movie/:id", () => {
        it("should delete a movie successfully", async () => {
            await request(app).get(`/delete-movie/${movieId}`).expect(302);
            const movie = await Movie.findById(movieId);
            expect(movie).to.be.null;
        });
    });
});