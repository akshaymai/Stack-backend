const {Book} = require("../Model/book");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getBookById = (req, res, next, id) => {
  Book.findById(id)
    .populate("category")
    .exec((err, book) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found"
        });
      }
      req.book = book;
      next();
    });
};

exports.createBook = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
    //destructure the fields
    const { book_name, description, author,price, category, stock } = fields;
   console.log(fields)
    if (!book_name || !description || !price || !category || !stock || !author) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }

    let book = new Book(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      book.photo.data = fs.readFileSync(file.photo.path);
      book.photo.contentType = file.photo.type;
    }
  

    //save to the DB
    book.save((err, bookd) => {
      
      if (err) {
        res.status(400).json({
          error: "Saving Book in DB failed"
        });
      }
      res.json(bookd);
    });
  });
};

exports.getbook = (req, res) => {
  req.book.photo = undefined;
  return res.json(req.book);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.book.photo.data) {
    res.set("Content-Type", req.book.photo.contentType);
    return res.send(req.book.photo.data);
  }
  next();
};

// delete controllers
exports.deleteBook =async (req, res) => {
  let book = req.book;

let checkbook=await Book.findById(req.params.bookId)
if(!checkbook){
  return res.status(500).send('book not found')
}
  book.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product"
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedProduct
    });
  });
};

// update controllers
exports.updateBook = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    let book = req.book;
    book = _.extend(book, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      book.photo.data = fs.readFileSync(file.photo.path);
      book.photo.contentType = file.photo.type;
    }
     

    //save to the DB
    book.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed"
        });
      }
      res.json(product);
    });
  });
};

//product listing

exports.getAllBook = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Book.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "NO product FOUND"
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Book.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found"
      });
    }
    res.json(category);
  });
};

// exports.updateBookStock = (req, res, next) => {
//   let myOperations = req.body.issue.books.map(book => {
//     return {
//       updateOne: {
//         filter: { _id: book._id },
//         update: { $inc: { stock: -book.count, sold: +book.count } }
//       }
//     };
//   });

//   Book.bulkWrite(myOperations, {}, (err, books) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Bulk operation failed"
//       });
//     }
//     next();
//   });
// };
