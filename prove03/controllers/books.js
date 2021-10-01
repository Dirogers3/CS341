const path = require('path');
const Book = require('../models/books');

exports.getAddBookPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'createbook.html'))
};

exports.postAddBook = (req, res, next) => {
    const books = new Book(req.body.title, req.body.description, req.body.price, req.body.rating);
    books.save();
    console.log(req.body);
    console.log(books);
    res.redirect('/admin');
}

exports.getBooks = (req, res, next) => {
    Book.fetchAll((books) => {
        res.render('index', {books: books})
    });
}