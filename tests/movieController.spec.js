const sinon = require("sinon");
const chai = require("chai");
const { expect } = require("chai");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");
const chaiHttp = require("chai-http");
const app = require("../app");
const Movie = require("../models/movie");

chai.use(sinonChai);
chai.use(chaiHttp);

const mongoose = require("mongoose");
const {describe, it} = require("mocha");

const sandbox = sinon.createSandbox();

let movieController = rewire("../controllers/movieController");

describe("Testing movie crud operations", () => {
    let findStub;
    let movieMock;
    beforeEach(() => {
        movieMock = {
            _id: "fake_movie_id",
            title: "fake movie",
            genre: "fake genre",
            releaseYear: 2023,
            director: "fake director",
            rating: 5
        };
        findStub = sandbox.stub(mongoose.Model, "find").resolves([movieMock]);
        findByIdStub = sandbox.stub(mongoose.Model, "findById").resolves(movieMock);
        findByIdAndUpdateStub = sandbox.stub(mongoose.Model, "findByIdAndUpdate").resolves(movieMock);
        findByIdAndDeleteStub = sandbox.stub(mongoose.Model, "findByIdAndDelete").resolves(movieMock);
    });
    afterEach(() => {
        movieController = rewire("../controllers/movieController");
        sandbox.restore();
    });

    describe("getMovies", () => {
        it("it should return error when there is one", (done) => {
            findStub.rejects(new Error("Database error"));
        
            chai.request(app)
                .get("/")
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.include("Database error");
                    done();
                });
        });
        
        it("it should render index.html and pass movies", (done) => {
            chai.request(app)
                .get("/")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include(movieMock.title);
                    done();
                });
        });
    });
    describe("getAddMoviePage", () => {

        it("should return an error if there is an issue rendering the page", (done) => {
            const renderStub = sinon.stub(app, "render").throws(new Error("Rendering error"));
            
            chai.request(app)
                .get("/add-movie")
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.include("Rendering error");
                    renderStub.restore();
                    done();
                });
        });
        
        it("should render the add_movie.ejs page successfully", (done) => {
            chai.request(app)
                .get("/add-movie")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include("<h1>Add a new movie to the list!</h1>");
                    done();
                });
        });
    })

    describe("getEditMoviePage", () => {

        it("should return an error if there is an issue rendering the page", (done) => {
            findByIdStub.rejects(new Error("Database error"));

            chai.request(app)
                .get("/edit-movie/:id")
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.include("Database error");
                    done();
                });
        });
        
        it("should render the add_movie.ejs page successfully", (done) => {
            chai.request(app)
                .get("/edit-movie/:id")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include("<h1>Edit a new movie in the list!</h1>");
                    done();
                });
        });
    });

    describe("createOrUpdateMovie", () => {

        // beforeEach(async () => {
        //     saveStub = sandbox.stub().returns(movieMock);
        //     movieModelStub = sandbox.stub().returns({
        //         save: saveStub,
        //     });
      
        //     movieController.__set__("Movie", movieModelStub);
        // });
        beforeEach(async () => {
            saveStub = sandbox.stub().resolves(movieMock);  // Ensure the stub resolves with the movieMock
            movieModelStub = sandbox.stub(Movie.prototype, 'save').callsFake(saveStub);  // Stubbing `Movie.save()`
        });

        it("should update an existing movie when _id is in the request body", (done) => {

            chai.request(app)
                .post("/")
                .send(movieMock)
                .end((err, res) => {
                    console.log("Response Status:", res.status);
                    expect(findByIdAndUpdateStub).to.have.been.calledOnce;
                    expect(findByIdAndUpdateStub).to.have.been.calledOnceWith(movieMock._id, movieMock);
                    expect(res).to.have.status(200);
                    findByIdAndUpdateStub.restore();
                    done();
                });
        });
        
        it("should create a new movie when there is no _id in the request body", (done) => {
            const originalId = movieMock._id;
            delete movieMock._id;
        
            chai.request(app)
                .post("/")
                .send(movieMock)
                .end((err, res) => {
                    console.log("Response Status:", res.status);
                    expect(saveStub).to.have.been.calledOnce;
                    expect(res).to.have.status(200);
                    movieMock._id = originalId;
                    done();
                });
        });
    });
    describe("deleteMovie", () => {
        
        it("should delete a movie successfully and redirect", (done) => {
            findByIdAndDeleteStub.withArgs("fake_movie_id").resolves(movieMock);

            chai.request(app)
                .get("/delete-movie/fake_movie_id")
                .end((err, res) => {
                    expect(findByIdAndDeleteStub).to.have.been.calledOnceWith("fake_movie_id");
                    expect(res).to.have.status(200);
                    expect(res).to.redirect;
                    done();
                });
        });
    
        it("should return a error if deletion fails", (done) => {
            findByIdAndDeleteStub.rejects(new Error("Database error"));
    
            chai.request(app)
                .get("/delete-movie/fake_movie_id")
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.text).to.include("Database error");
                    done();
                });
        });
    });
});
