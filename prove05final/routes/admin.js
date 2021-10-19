const express = require('express');
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/', adminController.getBooks);

router.get('/addbook', isAuth, adminController.getAddBookPage);

router.post('/book', isAuth, adminController.postAddBook);

router.get('/edit-book/:bookId', isAuth, adminController.getEditBook);

router.post('/edit-book', isAuth, adminController.postEditBook);

router.post('/delete-book', isAuth, adminController.postDeleteBook);

module.exports = router; 