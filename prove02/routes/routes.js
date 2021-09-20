const path = require('path');
const express = require('express');
const { appendFile } = require('fs');

const router = express.Router();

const books = [];

router.get('/addbook', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'createbook.html'))
});

router.post('/book', (req, res, next) => {
    books.push({title : req.body.title, description : req.body.description, price : req.body.price, rating : req.body.rating})
    console.log(req.body);
    console.log(books);
    res.redirect('/');
});

router.use('/deletebook', (req, res, next) => {
    books.pop();
    res.redirect('/');
})

router.use('/', (req, res, next) => {
    res.render('index', {books: books})

});





module.exports = router; 