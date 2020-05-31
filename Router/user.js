const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  studentBookIssueList
 
} = require("../Controller/user");

const { isSignedIn, isAuthenticated } = require("../Controller/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get("/user/bookIssueList/:userId",isSignedIn,isAuthenticated,studentBookIssueList)

 
module.exports = router;