const express = require("express");
const router = express.Router();

const {
  getBookById,
  createBook,
  getbook,
  photo,
  updateBook,
  deleteBook,
  getAllBook,
  getAllUniqueCategories
} = require("../Controller/book");

const { isSignedIn, isAuthenticated, isAdmin } = require("../Controller/auth");
const { getUserById } = require("../Controller/user");

//all of params
router.param("userId", getUserById);
router.param("bookId", getBookById);

//all of actual routes
//create route
router.post(
  "/book/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createBook
);

// read routes
router.get("/book/:bookId", getbook);
router.get("/book/photo/:bookId", photo);

//delete route
router.delete(
  "/product/:bookId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteBook
);

//update route
router.put(
  "/product/:bookId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateBook
);

//listing route
router.get("/products", getAllBook);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
