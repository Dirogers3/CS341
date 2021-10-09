const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                bookId: {
                    type: Schema.Types.ObjectId,
                    ref:'Books',
                    required: true
                },
                quantity: {type: Number, required: true}}]
    }
});

userSchema.methods.addToCart = function(book) {
    const cartBookIndex = this.cart.items.findIndex(cp => {
        console.log("this is here: "+ cp.bookId.toString());
        return book._id.toString() === cp.bookId.toString(); 
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartBookIndex >= 0) {
        console.log("in the If statement")
        newQuantity = this.cart.items[cartBookIndex].quantity + 1;
        updatedCartItems[cartBookIndex].quantity = newQuantity;
    } else {
        console.log(JSON.stringify(book));
        updatedCartItems.push({
            bookId: book._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function(bookId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.bookId.toString() !== bookId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);