const Book = require('../models/books')

exports.getAddBookPage = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/createbook', {
        pageTitle: 'Add Book',
        path: '/admin/add-book',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    })
};

// CREATE A BOOK
exports.postAddBook = (req, res, next) => {
    const books = new Book({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        rating: req.body.rating,
        userId: req.user});
    books.save()
    .then(result => {
        console.log('Added book into Database');
    })
    .catch(err => {
        console.log(err);
    })
    res.redirect('/');
}


exports.getEditBook = (req, res, next) => {
    console.log("This is working")
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
            isAuthenticated: req.session.isLoggedIn
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
    
    Book.findById(bookId)
    .then(book => {
        book.title = updatedTitle
        book.description = updatedDescription;
        book.price = updatedPrice;
        book.rating = updatedRating;
        book.userId = userId;
        return book.save()
    },[0])
    .then(result => {
        console.log("Updated Book");
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    })
}

// GET ALL BOOKS
exports.getBooks = (req, res, next) => {
    Book.find()
    // I can select what things to pass through these...
    // .select('title price description-_id')
    // .populate('userId', 'name')
    .then(book => {
        res.render('index.ejs', {
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
    Book.findByIdAndRemove(bookId)
    .then(()=>{
        console.log("Removed Book");
        res.redirect('/');
    })
    .catch(err=>{
        console.log(err);
    })
}