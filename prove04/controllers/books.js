const path = require('path');
const Book = require('../models/books');
const Order = require('../models/order');

exports.getAddBookPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'createbook.html'))
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
    res.redirect('/admin');
}

// GET ONE BOOK BY ID
exports.getBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
    .then(book => {
        res.render('detail.ejs', {
            book: book,
        })
    })
    .catch(err=>{
        console.log(err)
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
            books: book
        })
    })
}


// UPDATE A BOOK BY ID


exports.postEditBook = (req, res, next) => {
    const bookId = req.body.bookId;
    console.log("This is the ID:" + bookId)
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const updatedRating = req.body.rating;
    
    Book.findById(bookId)
    .then(book => {
        book.title = updatedTitle
        book.description = updatedDescription;
        book.price = updatedPrice;
        book.rating = updatedRating;
        return book.save()
    },[0])
    .then(result => {
        console.log("Updated Book");
        res.redirect('/admin');
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
        res.render('edit', {
            book:book
        });
    })
    .catch(err => {
        console.log(err);
    })
}

// DELETE A BOOK BY ID

exports.postDeleteBook = (req, res, next) => {
    const bookId = req.body.bookId;
    Book.findByIdAndRemove(bookId)
    .then(()=>{
        console.log("Removed Book");
        res.redirect('/admin');
    })
    .catch(err=>{
        console.log(err);
    })
}

// Other exports....

exports.getCart = (req, res, next) => {
    req.user
    .populate('cart.items.bookId')
    .then(user => {
        const books = user.cart.items;
        res.render('cart.ejs', {
            books: books
        });
    })
    .catch(err => {console.log(err);})
}

exports.postCart = (req, res, next) => {
    console.log("Adding to cart");
    const bookId = req.body.bookId;
    console.log(bookId);
    Book.findById(bookId)
    .then(book => {
        return req.user.addToCart(book);
    })
    .then(result => {
        console.log(result);
        res.redirect('/admin')
    })
}

exports.postCartDeleteBook = (req, res, next) => {
    const bookId = req.body.bookId;
    req.user
    .removeFromCart(bookId)
    .then(result => {
        res.redirect('/admin/cart');
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
                name: req.user.name,
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
        res.redirect('/admin/orders');
    })
    .catch(err=>{console.log(err)});
}

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id }).then(orders => {
            res.render('orders.ejs', {
                orders: orders
            });
        })
        .catch(err=>console.log(err));
};