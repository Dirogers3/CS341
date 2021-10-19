const path = require('path');
const Book = require('../models/books');
const Order = require('../models/order');

exports.getBooks = (req, res, next) => {
    Book.find()
    .then(books => {
        res.render('shop/book-list', {
            books: books,
            pageTitle: 'All Books',
            path: '/books',
            
        });
    })
    .catch(err => {
        console.log(err);
    });
}

// GET ONE BOOK BY ID
exports.getBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
    .then(book => {
        res.render('shop/detail', {
            book: book,
            pageTitle: book.title,
            path: '/books',
            
        })
    })
    .catch(err=>{console.log(err)})
};

exports.getIndex = (req, res, next) => {
    Book.find()
        .then(books => {
            res.render('shop/index', {
            books: books,
            pageTitle: 'Shop',
            path: '/',
            
            });
        })
        .catch(err => {console.log(err)});
};

// Other exports....

exports.getCart = (req, res, next) => {
    req.user
    .populate('cart.items.bookId')
    .then(user => {
        const books = user.cart.items;
        res.render('shop/cart', {
            books: books,
            pageTitle: 'Your Cart',
            path: '/cart',
            
        });
    })
    .catch(err => {console.log(err);})
}

exports.postCart = (req, res, next) => {
    const bookId = req.body.bookId;
    Book.findById(bookId)
    .then(book => {
        return req.user.addToCart(book)
    })
    .then(result => {
        res.redirect('/cart')
    })
}

exports.postCartDeleteBook = (req, res, next) => {
    const bookId = req.body.bookId;
    req.user
        .removeFromCart(bookId)
        .then(result => {
            res.redirect('/cart');
        })
    .catch(err=>{console.log(err)})
}

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.bookId')
    .then(user => {
        const books = user.cart.items.map(i=> {
            return {quantity: i.quantity, book: {...i.bookId._doc}};
        });
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            books: books
        });
        return order.save();
    })
    .then(result=>{
        return req.user.clearCart();
    })
    .then(()=>{
        res.redirect('/orders');
    })
    .catch(err=>{console.log(err)});
}

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id }).then(orders => {
            res.render('shop/orders', {
                orders: orders,
                path: '/orders',
                pateTitle: 'Your Orders',
                
            });
        })
        .catch(err=>console.log(err));
};