const Book = require('../models/books')
const { validationResult } = require('express-validator');

exports.getAddBookPage = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/createbook', {
        pageTitle: 'Add Book',
        path: '/admin/add-book',
        editing: false,
        errorMessage: null,
        validationErrors: []
    });
};

// CREATE A BOOK
exports.postAddBook = (req, res, next) => {
    const errors= validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit', {
            pageTitle: 'Add book',
            path: '/admin/edit',
            hasError: true,
            book: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                rating: req.body.rating,
                userId: req.user
            },
            errorMEssage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const books = new Book({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        rating: req.body.rating,
        userId: req.user});
    books
        .save()
        .then(result => {
            console.log('Added book into Database');
            res.redirect('/admin/books')
        })
        .catch(err => {
            console.log(err);
        })
}


exports.getEditBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
    .then(book => {
        if (!book) {
            return res.redirect('/');
        }
        res.render('admin/edit', {
            book:book,
            pageTitle: 'Edit Book',
            path: '/admin/edit-book',
            hasError: false,
            errorMessage: req.flash('error'),
            validationErrors: []
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postEditBook = (req, res, next) => {
    const bookId = req.body.bookId;
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const updatedRating = req.body.rating;
    const userId = req.user;
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit', {
            pageTitle: 'Edit Book',
            path: '/admin/edit',
            hasError: true,
            book: {
                title :updatedTitle,
                description :updatedDescription,
                price :updatedPrice,
                rating :updatedRating,
                userId :userId,
                _id : bookId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
     

    Book.findById(bookId)
    .then(book => {
        const bookUserId = JSON.stringify(book.userId)
        const reqUserId = JSON.stringify(req.user._id)
        if (bookUserId !== reqUserId) {
            console.log('UserId does not match');
            return res.redirect('/');
        }
        book.title = updatedTitle
        book.description = updatedDescription;
        book.price = updatedPrice;
        book.rating = updatedRating;
        book.userId = userId;
        return book.save().then(result => {
            console.log("Updated Book");
            res.redirect('/');
        })
    },[0])
    
    .catch(err => {
        console.log(err);
    })
}

// GET ALL BOOKS
exports.getBooks = (req, res, next) => {
    Book.find({userId : req.user._id})
    // I can select what things to pass through these...
    // .select('title price description-_id')
    // .populate('userId', 'name')
    .then(book => {
        res.render('admin/books', {
            books: book,
            pageTitle: 'Admin Books',
            path: '/admin/books',
            isAuthenticated: req.session.isLoggedIn
        })
    })
}

// DELETE A BOOK BY ID

exports.postDeleteBook = (req, res, next) => {
    const bookId = req.body.bookId;
    Book.deleteOne({_id: bookId, userId: req.user._id})
    .then(()=>{
        console.log("Removed Book");
        res.redirect('/');
    })
    .catch(err=>{
        console.log(err);
    })
}