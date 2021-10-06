
const express = require('express');
const booksController = require('../controllers/books')

const router = express.Router();


router.get('/addbook', booksController.getAddBookPage);

router.post('/book', booksController.postAddBook);

router.use('/', booksController.getBooks);


module.exports = router; 