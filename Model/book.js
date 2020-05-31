const mongoose = require('../Dbconnection');
const {ObjectId}  = mongoose.Schema;

const bookSchema = new mongoose.Schema(
  {
    book_name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    author:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true
    },
    stock: {
      type: Number,
      required:true
    },
    sold: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    }
  },
  { timestamps: true }
);

 
const Book = mongoose.model("Book", bookSchema,'Book');

 module.exports ={Book,bookSchema}