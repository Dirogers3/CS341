const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const booksSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Books', booksSchema);

// const fs = require('fs');
// const path = require('path');

// const p = path.join(path.dirname(process.mainModule.filename),'data', 'books.json');


// const getBooksFromFile = cb => {
//     fs.readFile(p, (err, fileContent) => {
//         if (err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     });
// };

// module.exports = class Books {
//     constructor(title, description, price, rating) {
//         this.title = title;
//         this.description = description;
//         this.price = price;
//         this.rating = rating 
//     }

//     save() {
//         this.id = Math.random().toString();
//         getBooksFromFile(books=> {
//             books.push(this);
//             fs.writeFile(p, JSON.stringify(books), (err) => {
//                 console.log(err);
//             });
//         });
//     }

//     static fetchAll(cb) {
//         getBooksFromFile(cb);
//     }
// };

