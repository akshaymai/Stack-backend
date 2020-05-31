const {User} = require("../Model/user");
const {  validationResult,check} = require('express-validator');
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const bcrypt=require('bcryptjs')

//*Registration//
exports.registration =async (req, res) => {
  const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
            error: errors.array()[0].msg
            }); 
        }

        let checkuser=await User.findOne({email:req.body.email})
        if(checkuser){
        return res.status(422).send({error:'user is already registerd'})
        }

let user=new User(req.body);

  user.save().then((users)=>{
    res.json({
              name: users.name,
              email: users.email,
              id: user._id,
              role:users.role
            });
  }).catch((err)=>{
    res.status(500).send(err)
  })
};


//***Login */

exports.login = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }


let checkser=await User.findOne({email:req.body.email})
 
if(!checkser){
  return res.status(400).json({error:'user is not registerd....'})
}
let comparepassword=await bcrypt.compare(req.body.password,checkser.password)
 
if(!comparepassword){
  return res.status(400).json({error:'password not match....'})
}
const token=jwt.sign({_id:checkser._id},process.env.SECRET)
res.cookie("token",token,{expire:  new Date() + 9999})
// const { email,_id,name,role}=checkser

  return res.json({ token, user: {

    "email":checkser.email,
    "_id":checkser._id,
    "role":checkser.role,
    "name":checkser.name
  } });
    
 
};

//logout 
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"
});


//custom middlewares ,check user is Authenticate or not 
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  next();
};


//admin check middleware
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    });
  }
  next();
};
