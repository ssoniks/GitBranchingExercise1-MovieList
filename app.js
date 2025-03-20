const express = require("express");
const movieRoutes = require("./routes/movieRoutes");
const connectDB = require("./config/database");

const app = express();

connectDB();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/", movieRoutes);

module.exports = app;