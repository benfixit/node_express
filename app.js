const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/nodekb');

let db = mongoose.connection;

db.once('open', function(){
    console.log("Hurray!");
});

//Init app
const app = express();

//Bring in modules
let Article = require('./models/article'); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err){
            console.log(err);
        } else {
            res.render('index', {
                title: "Articles",
                articles: articles
            });
        }
    });
});

//Get Single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
    });
});

//Load edit article form
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            article: article
        });
    });
});

app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: "Add Article"
    });
});

//Add article
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});

//Submit article edit
app.post('/article/edit/:id', (req, res) => {
        let article = {};

        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        let query = {_id: req.params.id};

        Article.update(query, article, function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect('/article/' + query._id);
            }
        });
});

app.delete('/article/:id', (req, res) => {
    let query = {_id: req.params.id};

    Article.remove(query, (err) => {
        if(err){
            console.log(err);
        }else{
            res.send('Success');
        }
    });
});


app.listen(3000, function(){
    console.log("Server started on port 3000...");
});