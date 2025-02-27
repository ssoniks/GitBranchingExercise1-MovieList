const express = require("express");
const mongoose = require('mongoose');
const app = express();

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