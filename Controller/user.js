const {User} = require("../Model/user");
const {IssueBook}=require('../Model/bookIssue')
// const Order = require("../models/order");

//*Get userby ID*//
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.profile = user;
    next();
  });
};


//Get User//
exports.getUser = (req, res) => {

  req.profile.password = undefined;
  return res.json(req.profile);
};

//*Update User*//
exports.updateUser = (req, res) => {
    const update=Object.keys(req.body)
  const allowupdate=['name','email','password']
const checkupdate=update.every((updates)=>{
    return allowupdate.includes(updates)
})
if(!checkupdate){
    return res.status(404).send('please enter valide field')
}

req.body.password=bcrypt.hashSync(req.body.password,8)
    User.findByIdAndUpdate({_id:req.profile._id},{$set:req.body},{new:true,useFindAndModify: false},(err,user)=>{
        if(err) return res.status(500).send(err)
        res.send(user)
    })
};

exports.studentBookIssueList = (req, res) => {
  IssueBook.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, isuues_book) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this account"
        });
      }
      return res.json(isuues_book);
    });
};

