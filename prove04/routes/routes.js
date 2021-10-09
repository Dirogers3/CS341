
const express = require('express');
const booksController = require('../controllers/books')

const router = express.Router();


router.get('/addbook', booksController.getAddBookPage);

router.post('/book', booksController.postAddBook);

router.get('/books/:bookId', booksController.getBook);

router.get('/edit-book/:bookId', booksController.getEditBook);

router.post('/edit-book', booksController.postEditBook);

router.post('/delete-book', booksController.postDeleteBook);

router.get('/cart', booksController.getCart);

router.post('/cart', booksController.postCart);

router.post('/cart-delete-item', booksController.postCartDeleteBook);

router.post('/create-order', booksController.postOrder);

router.get('/orders', booksController.getOrders);

router.use('/', booksController.getBooks);




module.exports = router; 