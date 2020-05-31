const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../Controller/auth");
const { getUserById } = require("../Controller/user");


const {
  getissueId,
  createbookissue,
  getAllIsuueBook,
  getissueBookStatus,
  updateStatus
} = require("../Controller/bookissue");

//params
router.param("userId", getUserById);
router.param("issueId", getissueId);

//Actual routes
//create
router.post(
  "/issue/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createbookissue,
   
  // updateBookStock,

);

//read
router.get(
  "/issuebook/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllIsuueBook
);

//status of order
router.get(
  "/issue/status/:issueId/:userId",
  isSignedIn,
  isAuthenticated,
  getissueBookStatus
);

//update of status by admin
router.put(
  "/issue/:issueId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
